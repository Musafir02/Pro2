
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
                    "content": f"""Analyze the following resume data and provide actionable suggestions for improvement and learning recommendations.

Resume Data:
{json.dumps(resume_data, indent=2)}

Please provide:
1. Resume improvement suggestions (focus on content, formatting, missing elements, quantifiable achievements)
2. Learning recommendations based on the person's field and experience

Format your response as JSON with 'improvements' and 'learning' arrays."""
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
