
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
        
        # Use OpenRouter with DeepSeek model
        from openai import OpenAI
        client = OpenAI(
            api_key=os.getenv('OPENAI_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional career coach and resume expert. Provide specific, actionable advice for resume improvement and career development."
                },
                {
                    "role": "user",
                    "content": f"""Analyze this resume data and provide personalized career advice and learning recommendations.

Resume Data:
{json.dumps(resume_data, indent=2)}

Based on the user's experience, skills, and career goals, provide:

1. **Resume Improvements**: Specific suggestions to enhance their resume
2. **Learning Path**: Technologies, skills, or certifications they should learn to advance their career
3. **Job Market Insights**: What employers are looking for in their field
4. **Skill Gaps**: Missing skills that would make them more competitive

Format your response as a structured JSON with these sections:
{{
  "resume_improvements": [
    "specific improvement suggestion 1",
    "specific improvement suggestion 2"
  ],
  "learning_recommendations": [
    {{
      "skill": "Python",
      "reason": "High demand in data science roles",
      "priority": "High",
      "resources": "Start with Python basics, then move to data analysis libraries"
    }}
  ],
  "market_insights": [
    "insight about current job market trends"
  ],
  "skill_gaps": [
    "missing skill that would help career growth"
  ]
}}"""
                }
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return jsonify({
            'success': True,
            'suggestions': response.choices[0].message.content
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
