from flask import render_template, Blueprint, request, jsonify, session, redirect, url_for
from flask import current_app as app
import requests
import anthropic
import json
import random
import os
import hashlib
from datetime import datetime, timedelta
import threading

claude_api_key = os.getenv("CLAUDEAPIKEY")

main = Blueprint("main", __name__)
client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key=claude_api_key
)


@main.route("/")
def index():
    last_cache_check = session.get('last_cache_check')
    if not last_cache_check or datetime.now() - datetime.fromisoformat(last_cache_check) >= timedelta(hours=1):
        # Run manage_cache in the background
        thread = threading.Thread(target=manage_cache)
        thread.start()
        session['last_cache_check'] = datetime.now().isoformat()

    return render_template("index.html")

@main.route("/welcome")
def welcome():
    if session.get("is_logged_in"):
        last_cache_check = session.get('last_cache_check')
        if not last_cache_check or datetime.now() - datetime.fromisoformat(last_cache_check) >= timedelta(hours=1):
            # Run manage_cache in the background
            thread = threading.Thread(target=manage_cache)
            thread.start()
            session['last_cache_check'] = datetime.now().isoformat()
        return render_template("welcome.html", email=session["email"])
    else:
        return redirect(url_for("main.index"))
    
@main.route("/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        email = request.get_json()["email"]
        password = request.get_json()["password"]

        try:
            user = app.auth.sign_in_with_email_and_password(email, password)
            session["is_logged_in"] = True
            session["email"] = email
            session["local_id"] = user["localId"]
            
            return jsonify({"success": True, "redirect": url_for("main.welcome")})
        except:
            return jsonify({"success": False, "error": "Invalid username/email or password"}), 401
        
@main.route("/signup", methods = ["POST", "GET"])
def signup():
    if request.method == "POST":
        email = request.get_json()["email"]
        password = request.get_json()["password"]
        name = request.get_json()["name"]
        username = request.get_json()["username"]

        try:
            app.auth.create_user_with_email_and_password(email, password)
            user = app.auth.sign_in_with_email_and_password(email, password)
            print(user)
            session["is_logged_in"] = True
            session["email"] = email
            session["local_id"] = user["localId"]
            data = {
                "name" : name, 
                "username" : username, 
                "email" : email,
                "seen_questions" : {},
                "score" : 0
            }
            app.db.child("users").child(user["localId"]).set(data)

            return jsonify({"success": True, "redirect": url_for("main.welcome")})
        except Exception as e:
            error_message = str(e)
    
            if len(e.args) > 1:
                try:
                    error_json = json.loads(e.args[1])
                except json.JSONDecodeError:
                    pass

            if error_json and 'error' in error_json and 'message' in error_json['error']:
                error_message = error_json['error']['message']

            if "EMAIL_EXISTS" in error_message:
                error = "Email already exists"
            elif "WEAK_PASSWORD" in error_message:
                error = "Password should be at least 6 characters"
            elif "INVALID_EMAIL" in error_message:
                error = "The email address is badly formatted"
            else:
                error = f"An error occurred during signup: {error_message}"

            print(f"Debug - Full error: {error_message}")
            return jsonify({"success": False, "error": error}), 400
        
@main.route("/logout")
def logout():
    session["is_logged_in"] = False

    return redirect(url_for("main.index"))

@main.route("/quiz")
def quiz():
    if session["is_logged_in"]:
        return render_template("quiz.html")
    else:
        return redirect(url_for("main.index"))

def update_user_score(user_id, score):

    current_score = app.db.child("users").child(user_id).child("score").get().val() or 0
    new_score = max(current_score, score)  # Update only if the new score is higher
    app.db.child("users").child(user_id).update({"score": new_score})

@main.route("/update_score", methods=["POST"])
def update_score():
    if session.get("is_logged_in"):
        user_id = session["local_id"]
        print(user_id)
        score = request.json.get("score")
        print(score)
        update_user_score(user_id, score)
        return jsonify({"success": True}), 200
    return jsonify({"error": "User not logged in"}), 401


@main.route("/leaderboard")
def leaderboard():
    try:
        users = app.db.child("users").order_by_child("score").limit_to_last(10).get()
        leaderboard_data = []
        if users.val():
            for user_id, user_data in users.val().items():
                leaderboard_data.append({
                    "username": user_data.get("username", "Unknown"),
                    "score": user_data.get("score", 0)
                })
        leaderboard_data.sort(key=lambda x: x["score"], reverse=True)
        return render_template("leaderboard.html", leaderboard_data=leaderboard_data)
    except Exception as e:
        print(f"Error fetching leaderboard: {e}")
        return render_template("error.html", error="Failed to fetch leaderboard")
    
@main.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

@main.route("/test")
def test():
    return render_template("test.html")

def manage_cache():
    languages = ['Python', 'JavaScript', 'C++']
    categories = ['Loops', 'Conditionals', 'Functions', 'Variables', 'Arrays', "Debugging"]
    levels = range(1, 6)

    for language in languages:
        for category in categories:
            for level in levels:
                cache_key = f"{language}_{category}_{level}"
                
                # Refresh prompts older than 7 days
                prompt_data = app.db.child("cached_prompts").child(cache_key).get().val()
                if not prompt_data or datetime.now() - datetime.fromisoformat(prompt_data['timestamp']) >= timedelta(days=7):
                    get_or_create_prompt(language, category, level)
                    print(f"Refreshed prompt for {cache_key}")

                # Maintain question cache
                cached_questions = app.db.child("cached_questions").child(cache_key).get().val() or []
                if len(cached_questions) < 20:  # Maintain at least 20 questions per combination
                    new_questions = generate_new_questions(language, category, level, 20 - len(cached_questions))
                    cached_questions.extend(new_questions)
                    app.db.child("cached_questions").child(cache_key).set(cached_questions)
                    print(f"Generated {len(new_questions)} new questions for {cache_key}")

def get_or_create_prompt(language, category, level):
    prompt_key = f"{language}_{category}_{level}"
    prompt_data = app.db.child("cached_prompts").child(prompt_key).get().val()

    if prompt_data and datetime.now() - datetime.fromisoformat(prompt_data['timestamp']) < timedelta(days=7):
        return prompt_data['prompt']

    new_prompt = f"""Generate 5 multiple-choice questions for a {language} coding quiz.
    Category: {category}
    Difficulty level: {level} (1 is easiest, 5 is hardest)
    
    For each question, provide:
    1. The question text
    2. Four answer options
    3. The correct answer
    
    Ensure questions are appropriate for middle school students and cover fundamental concepts.
    Format the output as a JSON array of objects, each with keys: 'question', 'options' (an array), and 'correctAnswer'."""

    app.db.child("cached_prompts").child(prompt_key).set({
        'prompt': new_prompt,
        'timestamp': datetime.now().isoformat()
    })

    return new_prompt

def generate_new_questions(language, category, level, num_questions=5):
    prompt = get_or_create_prompt(language, category, level)

    response = client.beta.prompt_caching.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2048,
        system=[
            {
                "type": "text",
                "text": "You are a state of the art quiz question generator for middle school, high school and elementary school kids"
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                        "cache_control": {"type": "ephemeral"}
                    }
                ]
            }
        ]
    )

    response_json = json.loads(response.model_dump_json())
    print(json.dumps(response_json, indent=2))  # Pretty print the response for debugging
    
    if response_json['content']:
        # Extract the text content from the response
        questions_text = response_json['content'][0]['text']
        
        # Find the start and end of the JSON array in the text
        start = questions_text.find('[')
        end = questions_text.rfind(']') + 1
        
        if start != -1 and end != -1:
            # Extract and parse the JSON array
            questions_json = questions_text[start:end]
            questions = json.loads(questions_json)
            
            for q in questions:
                # Create a JSON-serializable version of the question
                serializable_q = {
                    'question': q['question'],
                    'options': q['options'],
                    'correctAnswer': q['correctAnswer']
                }
                q['id'] = hashlib.md5(json.dumps(serializable_q, sort_keys=True).encode()).hexdigest()
            return questions
        else:
            print("Error: Could not find JSON array in the response")
            return []
    else:
        print(f"Error generating questions: {json.dumps(response_json, indent=2)}")
        return []

@main.route("/generate_questions", methods=["POST"])
def generate_questions():
    data = request.json
    language = data.get("language")
    category = data.get("category")
    level = data.get("level")
    num_questions = data.get("num_questions", 5)
    user_id = session.get("local_id")

    # Fetch user's seen questions
    user_data = app.db.child("users").child(user_id).get().val()
    seen_questions = user_data.get("seen_questions", {}).get(f"{language}_{category}_{level}", [])

    # Check cache for available questions
    cached_questions = app.db.child("cached_questions").child(f"{language}_{category}_{level}").get().val() or []
    available_questions = [q for q in cached_questions if q['id'] not in seen_questions]

    # If we don't have enough available questions, generate more
    while len(available_questions) < num_questions:
        new_questions = generate_new_questions(language, category, level, 5)  # Generate in batches of 5
        cached_questions.extend(new_questions)
        app.db.child("cached_questions").child(f"{language}_{category}_{level}").set(cached_questions)
        available_questions.extend([q for q in new_questions if q['id'] not in seen_questions])

    # Select questions for the user
    selected_questions = random.sample(available_questions, num_questions)

    # Update user's seen questions
    for question in selected_questions:
        seen_questions.append(question['id'])
    app.db.child("users").child(user_id).child("seen_questions").child(f"{language}_{category}_{level}").set(seen_questions)

    return jsonify(selected_questions)