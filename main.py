from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        resume_data = data.get('resumeData', {})
        
        # Check if API key is available
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            # Provide informative message about API key setup
            if data.get('type') == 'chat':
                return jsonify({
                    'success': True,
                    'response': "To get AI-powered responses, please set up your OpenAI API key in the Secrets tab. For now, I can provide general guidance based on your resume data. What would you like to know about your career development?"
                })
            else:
                # Provide mock AI suggestions based on resume data
                return provide_mock_ai_response(resume_data, data)

        # Use OpenAI API directly
        from openai import OpenAI
        client = OpenAI(api_key=api_key)

        if data.get('type') == 'chat':
            # Handle chat messages - can answer any question
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a knowledgeable AI assistant that can help with career advice, resume building, programming questions, general knowledge, and any other topics. Always provide helpful, accurate, and professional responses. When discussing career or resume topics, reference the user's resume data when relevant."
                    },
                    {
                        "role": "user", 
                        "content": f"""User's resume data for context: {json.dumps(resume_data)}

User's question: {data.get('message', '')}

Please provide a helpful and informative response to their question."""
                    }
                ],
                max_tokens=1000,
                temperature=0.7
            )
        else:
            # Handle AI suggestions for resume
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional career coach and resume expert. Provide specific, actionable advice for resume improvement and career development."
                    },
                    {
                        "role": "user", 
                        "content": f"""Analyze this resume data and provide personalized career advice and learning recommendations: {json.dumps(resume_data)}

Return the response in JSON format with these keys:
- resume_improvements: array of specific suggestions  
- learning_recommendations: array of objects with 'skill', 'reason', 'priority', 'resources'
- market_insights: array of current market trends
- skill_gaps: array of missing skills"""
                    }
                ],
                max_tokens=1000,
                temperature=0.3
            )

        if data.get('type') == 'chat':
            return jsonify({
                'success': True,
                'response': response.choices[0].message.content.strip()
            })
        else:
            return jsonify({
                'success': True,
                'suggestions': response.choices[0].message.content.strip()
            })

    except Exception as e:
        print(f"Error: {e}")
        # Fallback to mock response if API fails
        return provide_mock_ai_response(resume_data, data)

def provide_mock_ai_response(resume_data, request_data):
    """Provide AI-like suggestions based on resume data analysis"""
    personal_info = resume_data.get('personalInfo', {})
    experiences = resume_data.get('experiences', [])
    education = resume_data.get('education', [])
    skills = resume_data.get('skills', [])
    
    if request_data.get('type') == 'chat':
        message = request_data.get('message', '').lower()
        
        # Enhanced chat responses for various question types
        if any(word in message for word in ['experience', 'work', 'job']):
            response = "Based on your resume, I can see your work experience. Consider highlighting quantifiable achievements and using action verbs to make your experience more impactful. What specific aspect of your work experience would you like to improve?"
        elif any(word in message for word in ['skill', 'skills', 'technical']):
            response = f"Your current skills show a good foundation. I'd recommend adding more technical skills relevant to your field and current industry trends. What type of skills are you most interested in developing?"
        elif any(word in message for word in ['education', 'degree', 'university']):
            response = "Your educational background provides a solid foundation. Consider adding relevant certifications, online courses, or continuing education to strengthen your profile. Are you looking to pursue additional education?"
        elif any(word in message for word in ['programming', 'code', 'developer', 'software']):
            response = "For programming careers, focus on building a strong portfolio with diverse projects. Key skills like version control (Git), cloud platforms (AWS/Azure), and modern frameworks are highly valued. What programming languages are you most interested in?"
        elif any(word in message for word in ['interview', 'preparation']):
            response = "Interview preparation is crucial! Practice common questions, research the company, prepare specific examples using the STAR method (Situation, Task, Action, Result), and always have questions ready for the interviewer. Would you like tips for specific types of interviews?"
        elif any(word in message for word in ['salary', 'negotiate', 'pay']):
            response = "When negotiating salary, research market rates for your role and location, highlight your unique value proposition, and consider the entire compensation package including benefits. Timing and approach are key. What's your current career level?"
        elif any(word in message for word in ['career', 'change', 'transition']):
            response = "Career transitions can be exciting! Focus on transferable skills, consider additional training if needed, network in your target industry, and tailor your resume to highlight relevant experience. What field are you interested in transitioning to?"
        else:
            # General helpful response
            response = f"I'm here to help with any questions you have! Whether it's about career development, resume building, programming, interview preparation, or general advice, feel free to ask. Based on your resume, you have {len(experiences)} work experiences and {len(education)} educational qualifications. What would you like to know more about?"
            
        return jsonify({
            'success': True,
            'response': response
        })
    else:
        # Generate suggestions based on resume data
        suggestions = {
            "resume_improvements": [],
            "learning_recommendations": [],
            "market_insights": [],
            "skill_gaps": []
        }
        
        # Analyze personal info
        if not personal_info.get('summary'):
            suggestions["resume_improvements"].append("Add a professional summary to highlight your key strengths and career objectives")
        
        # Analyze experience
        if len(experiences) == 0:
            suggestions["resume_improvements"].append("Add work experience with specific achievements and quantifiable results")
        elif len(experiences) < 2:
            suggestions["resume_improvements"].append("Consider adding more relevant work experience or internships")
            
        # Analyze education
        if len(education) == 0:
            suggestions["resume_improvements"].append("Add your educational qualifications including degree and institution")
        
        # Analyze skills
        if len(skills) == 0:
            suggestions["skill_gaps"].append("Add technical skills relevant to your field")
            suggestions["learning_recommendations"].append({
                "skill": "Industry-specific technical skills",
                "reason": "Essential for career advancement",
                "priority": "High",
                "resources": "Online courses, certifications"
            })
        
        # Add general suggestions
        if personal_info.get('title'):
            title = personal_info['title'].lower()
            if 'developer' in title or 'engineer' in title:
                suggestions["learning_recommendations"].extend([
                    {
                        "skill": "Cloud Computing (AWS/Azure)",
                        "reason": "High demand in tech industry",
                        "priority": "High",
                        "resources": "AWS/Azure certification courses"
                    },
                    {
                        "skill": "DevOps Tools",
                        "reason": "Important for modern development workflow",
                        "priority": "Medium",
                        "resources": "Docker, Kubernetes tutorials"
                    }
                ])
                suggestions["market_insights"].extend([
                    "Cloud computing skills are in high demand",
                    "AI/ML integration is becoming essential",
                    "Remote work capabilities are valuable"
                ])
        
        # General market insights
        suggestions["market_insights"].extend([
            "Soft skills like communication and leadership are increasingly valued",
            "Continuous learning and adaptability are key differentiators",
            "Industry certifications can significantly boost career prospects"
        ])
        
        return jsonify({
            'success': True,
            'suggestions': json.dumps(suggestions)
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)