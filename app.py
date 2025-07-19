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
                    "content": f"""Based on this resume data: {json.dumps(resume_data)}

If this is a chat message, respond conversationally to: {data.get('message', '')}

Otherwise, analyze this resume data and provide personalized career advice and learning recommendations.

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
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)