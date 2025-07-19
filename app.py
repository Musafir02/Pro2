from flask import Flask, render_template, request, jsonify
import openai
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Load OpenAI API key securely from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"reply": "Please enter a message."}), 400

    try:
        # OpenAI Chat Completion call
        response = openai.ChatCompletion.create(
            model="gpt-4",  # You can use gpt-3.5-turbo if needed
            messages=[
                {"role": "system", "content": "You are a friendly and professional AI Career Coach."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})
    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "⚠️ Error processing your request. Please try again."}), 500

if __name__ == "__main__":
    app.run(debug=True)
