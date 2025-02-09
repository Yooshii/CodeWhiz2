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
import contextlib
from io import StringIO
import traceback

claude_api_key = os.getenv("CLAUDEAPIKEY")

main = Blueprint("main", __name__)
client = anthropic.Anthropic(
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
        return render_template("welcome.html", email=session["username"])
    else:
        return redirect(url_for("main.index"))
    
@main.route("/scorechart")
def scorechart():
    if session.get("is_logged_in"):
        user_id = session["local_id"]
        language_scores = {
            "python_score": app.db.child("users").child(user_id).child("python_score").child("total").get().val(),
            "java_score": app.db.child("users").child(user_id).child("java_score").child("total").get().val(),
            "c_score": app.db.child("users").child(user_id).child("c_score").child("total").get().val(),
            "cpp_score": app.db.child("users").child(user_id).child("cpp_score").child("total").get().val(),
            "csharp_score": app.db.child("users").child(user_id).child("csharp_score").child("total").get().val(),
            "js_score": app.db.child("users").child(user_id).child("js_score").child("total").get().val()
        }

        python_category_scores = {
            "loops_score": app.db.child("users").child(user_id).child("python_score").child("loops").get().val(),
            "conditionals_score": app.db.child("users").child(user_id).child("python_score").child("conditionals").get().val(),
            "functions_score": app.db.child("users").child(user_id).child("python_score").child("functions").get().val(),
            "variables_score": app.db.child("users").child(user_id).child("python_score").child("variables").get().val(),
            "arrays_score": app.db.child("users").child(user_id).child("python_score").child("arrays").get().val(),
            "debbuging_score": app.db.child("users").child(user_id).child("python_score").child("debbuging").get().val()
        }

        java_category_scores = {
            "loops_score": app.db.child("users").child(user_id).child("java_score").child("loops").get().val(),
            "conditionals_score": app.db.child("users").child(user_id).child("java_score").child("conditionals").get().val(),
            "functions_score": app.db.child("users").child(user_id).child("java_score").child("functions").get().val(),
            "variables_score": app.db.child("users").child(user_id).child("java_score").child("variables").get().val(),
            "arrays_score": app.db.child("users").child(user_id).child("java_score").child("arrays").get().val(),
            "debbuging_score": app.db.child("users").child(user_id).child("java_score").child("debbuging").get().val()
        }

        c_category_scores = {
            "loops_score": app.db.child("users").child(user_id).child("c_score").child("loops").get().val(),
            "conditionals_score": app.db.child("users").child(user_id).child("c_score").child("conditionals").get().val(),
            "functions_score": app.db.child("users").child(user_id).child("c_score").child("functions").get().val(),
            "variables_score": app.db.child("users").child(user_id).child("c_score").child("variables").get().val(),
            "arrays_score": app.db.child("users").child(user_id).child("c_score").child("arrays").get().val(),
            "debbuging_score": app.db.child("users").child(user_id).child("c_score").child("debbuging").get().val()
        }

        cpp_category_scores = {
            "loops_score": app.db.child("users").child(user_id).child("cpp_score").child("loops").get().val(),
            "conditionals_score": app.db.child("users").child(user_id).child("cpp_score").child("conditionals").get().val(),
            "functions_score": app.db.child("users").child(user_id).child("cpp_score").child("functions").get().val(),
            "variables_score": app.db.child("users").child(user_id).child("cpp_score").child("variables").get().val(),
            "arrays_score": app.db.child("users").child(user_id).child("cpp_score").child("arrays").get().val(),
            "debbuging_score": app.db.child("users").child(user_id).child("cpp_score").child("debbuging").get().val()
        }

        csharp_category_scores = {
            "loops_score": app.db.child("users").child(user_id).child("csharp_score").child("loops").get().val(),
            "conditionals_score": app.db.child("users").child(user_id).child("csharp_score").child("conditionals").get().val(),
            "functions_score": app.db.child("users").child(user_id).child("csharp_score").child("functions").get().val(),
            "variables_score": app.db.child("users").child(user_id).child("csharp_score").child("variables").get().val(),
            "arrays_score": app.db.child("users").child(user_id).child("csharp_score").child("arrays").get().val(),
            "debbuging_score": app.db.child("users").child(user_id).child("csharp_score").child("debbuging").get().val()
        }

        js_category_scores = {
            "loops_score": app.db.child("users").child(user_id).child("js_score").child("loops").get().val(),
            "conditionals_score": app.db.child("users").child(user_id).child("js_score").child("conditionals").get().val(),
            "functions_score": app.db.child("users").child(user_id).child("js_score").child("functions").get().val(),
            "variables_score": app.db.child("users").child(user_id).child("js_score").child("variables").get().val(),
            "arrays_score": app.db.child("users").child(user_id).child("js_score").child("arrays").get().val(),
            "debbuging_score": app.db.child("users").child(user_id).child("js_score").child("debbuging").get().val()
        }

        return jsonify({
            "language_scores": language_scores,
            "python_category_scores": python_category_scores,
            "java_category_scores": java_category_scores,
            "c_category_scores": c_category_scores,
            "cpp_category_scores": cpp_category_scores,
            "csharp_category_scores": csharp_category_scores,
            "js_category_scores": js_category_scores
        })
    else:
        return redirect(url_for("main.index"))

@main.route("/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        email_or_username = request.get_json()["email"]
        password = request.get_json()["password"]

        try:
            user = app.auth.sign_in_with_email_and_password(email_or_username, password)

        except:
            users = app.db.child("users").get().val()
            for uid, data in users.items():
                if data.get("username") == email_or_username:
                    user_id = uid
                    break
                else:
                    user_id = None
            
            if user_id:
                email = users[user_id]["email"]
                user = app.auth.sign_in_with_email_and_password(email, password)
            else:
                return jsonify({"success": False, "error": "Invalid username/email or password"}), 401
        
        session["is_logged_in"] = True
        session["email"] = user["email"]
        session["local_id"] = user["localId"]
        session["username"] = app.db.child("users").child(session["local_id"]).child("username").get().val()

        return jsonify({"success": True, "redirect": url_for("main.welcome")})

@main.route("/signup", methods = ["POST", "GET"])
def signup():
    if request.method == "POST":
        email = request.get_json()["email"]
        password = request.get_json()["password"]
        name = request.get_json()["name"]
        username = request.get_json()["username"]

        users = app.db.child("users").get().val()
        for uid, data in users.items():
            if data.get("username") == username:
                return jsonify({"success": False, "error": "Username already taken"}), 400

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
                "projects" : {},
                "python_score" : {
                    "loops" : 0,
                    "conditionals" : 0,
                    "functions" : 0,
                    "variables" : 0,
                    "arrays" : 0,
                    "debbuging" : 0,
                    "total": 0
                },
                "java_score" : {
                    "loops" : 0,
                    "conditionals" : 0,
                    "functions" : 0,
                    "variables" : 0,
                    "arrays" : 0,
                    "debbuging" : 0,
                    "total": 0
                },
                "c_score" : {
                    "loops" : 0,
                    "conditionals" : 0,
                    "functions" : 0,
                    "variables" : 0,
                    "arrays" : 0,
                    "debbuging" : 0,
                    "total": 0
                },
                "cpp_score" : {
                    "loops" : 0,
                    "conditionals" : 0,
                    "functions" : 0,
                    "variables" : 0,
                    "arrays" : 0,
                    "debbuging" : 0,
                    "total": 0
                },
                "csharp_score" : {
                    "loops" : 0,
                    "conditionals" : 0,
                    "functions" : 0,
                    "variables" : 0,
                    "arrays" : 0,
                    "debbuging" : 0,
                    "total": 0
                },
                "js_score" : {
                    "loops" : 0,
                    "conditionals" : 0,
                    "functions" : 0,
                    "variables" : 0,
                    "arrays" : 0,
                    "debbuging" : 0,
                    "total": 0
                },
                "total_score" : 0
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
        return render_template("quiz.html", email=session["username"])
    else:
        return redirect(url_for("main.index"))

def update_user_score(user_id, language, category, score):
    user_data = app.db.child("users").child(user_id).child(language).get().val()
    print("user_data: ", user_data)

    if user_data:
        current_language_score = user_data["total"]
        new_language_score = current_language_score + score
        app.db.child("users").child(user_id).child(language).update({"total": new_language_score})

        current_category_score = user_data[category]
        new_category_score = current_category_score + score
        app.db.child("users").child(user_id).child(language).update({category : new_category_score})

        current_total_score = app.db.child("users").child(user_id).child("total_score").get().val()
        new_total_score = current_total_score + score
        app.db.child("users").child(user_id).update({"total_score": new_total_score})

@main.route("/update_score", methods=["POST"])
def update_score():
    if session.get("is_logged_in"):
        user_id = session["local_id"]
        language = request.json.get("language")
        category = request.json.get("category")
        score = request.json.get("score")

        print(user_id, language, category, score)

        update_user_score(user_id, language, category, score)
        return jsonify({"success": True}), 200
    return jsonify({"error": "User not logged in"}), 401

@main.route("/leaderboard")
def leaderboard():
    if session["is_logged_in"]:
        try:
            # Fetch all users without ordering
            users = app.db.child("users").get()
            leaderboard_data = []
            if users.each():
                for user in users.each():
                    user_data = user.val()
                    if isinstance(user_data, dict):
                        leaderboard_data.append({
                            "username": user_data.get("username", "Unknown"),
                            "score": user_data.get("total_score", 0)
                        })
            
            # Sort the data on the Python side
            leaderboard_data.sort(key=lambda x: x["score"], reverse=True)
            
            # Take only the top 10
            leaderboard_data = leaderboard_data[:10]
            
            return render_template("leaderboard.html", leaderboard_data=leaderboard_data, email=session["username"])
        except Exception as e:
            print(f"Error fetching leaderboard: {e}")
            return render_template("error.html", error="Failed to fetch leaderboard" + str(e))
    else:
        return redirect(url_for("main.index"))

@main.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

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

@main.route("/generate_questions", methods=["POST"])
def generate_questions():
    data = request.json
    language = data.get("language")
    category = data.get("category")
    level = data.get("level")
    num_questions = data.get("num_questions", 5)
    user_id = session.get("local_id")

    cache_key = f"{language}_{category}_{level}"

    # Fetch user's seen questions
    user_data = app.db.child("users").child(user_id).get().val()
    seen_questions = user_data.get("seen_questions", {}).get(cache_key, [])

    # Fetch and clean cached questions
    cached_questions = app.db.child("cached_questions").child(cache_key).get().val() or []
    
    # Remove duplicates from cached questions based on question content
    unique_cached = []
    seen_content = set()
    for q in cached_questions:
        # Create a unique identifier based on question content
        content_hash = hashlib.md5(
            json.dumps({
                'question': q['question'],
                'options': q['options'],
                'correctAnswer': q['correctAnswer']
            }, sort_keys=True).encode()
        ).hexdigest()
        
        if content_hash not in seen_content:
            seen_content.add(content_hash)
            unique_cached.append(q)
    
    # Update cache with deduplicated questions
    app.db.child("cached_questions").child(cache_key).set(unique_cached)
    cached_questions = unique_cached

    # Get available questions (not seen by user)
    available_questions = [q for q in cached_questions if q['id'] not in seen_questions]

    # Generate new questions if needed
    attempts = 0
    max_attempts = 3  # Limit generation attempts to prevent infinite loops
    while len(available_questions) < num_questions and attempts < max_attempts:
        new_questions = generate_new_questions(language, category, level, max(5, num_questions - len(available_questions)))
        
        # Deduplicate new questions against existing cache
        for q in new_questions:
            content_hash = hashlib.md5(
                json.dumps({
                    'question': q['question'],
                    'options': q['options'],
                    'correctAnswer': q['correctAnswer']
                }, sort_keys=True).encode()
            ).hexdigest()
            
            if content_hash not in seen_content:
                seen_content.add(content_hash)
                cached_questions.append(q)
                if q['id'] not in seen_questions:
                    available_questions.append(q)
        
        attempts += 1

    # Update cache with new questions
    app.db.child("cached_questions").child(cache_key).set(cached_questions)

    # Select random questions from available pool
    selected_questions = []
    if available_questions:
        selected_questions = random.sample(
            available_questions,
            min(num_questions, len(available_questions))
        )

    # Update user's seen questions
    for question in selected_questions:
        if question['id'] not in seen_questions:
            seen_questions.append(question['id'])
    app.db.child("users").child(user_id).child("seen_questions").child(cache_key).set(seen_questions)

    return jsonify(selected_questions)

def generate_new_questions(language, category, level, num_questions=5):
    prompt = get_or_create_prompt(language, category, level)

    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": f"You are a programming quiz question generator for students. Generate unique questions that are different from previously generated ones. {prompt}\n\nIMPORTANT: Generate completely unique questions that are different from any previous questions. Ensure variety in both question content and structure."
            }
        ]
    )

    try:
        response_json = json.loads(response.model_dump_json())
        
        if response_json['content']:
            questions_text = response_json['content'][0]['text']
            start = questions_text.find('[')
            end = questions_text.rfind(']') + 1
            
            if start != -1 and end != -1:
                questions_json = questions_text[start:end]
                questions = json.loads(questions_json)
                
                # Generate IDs based on content to help identify duplicates
                for q in questions:
                    serializable_q = {
                        'question': q['question'],
                        'options': q['options'],
                        'correctAnswer': q['correctAnswer']
                    }
                    q['id'] = hashlib.md5(json.dumps(serializable_q, sort_keys=True).encode()).hexdigest()
                
                return questions
            
        print("Error: Could not find valid JSON array in the response")
        return []
        
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        return []

def manage_cache():
    languages = ['Python', 'Java', 'JavaScript', 'C++']
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

                # Clean and maintain question cache
                cached_questions = app.db.child("cached_questions").child(cache_key).get().val() or []
                
                # Remove duplicates
                unique_questions = []
                seen_content = set()
                for q in cached_questions:
                    content_hash = hashlib.md5(
                        json.dumps({
                            'question': q['question'],
                            'options': q['options'],
                            'correctAnswer': q['correctAnswer']
                        }, sort_keys=True).encode()
                    ).hexdigest()
                    
                    if content_hash not in seen_content:
                        seen_content.add(content_hash)
                        unique_questions.append(q)
                
                # Generate new questions if needed
                if len(unique_questions) < 20:
                    new_questions = generate_new_questions(language, category, level, 20 - len(unique_questions))
                    for q in new_questions:
                        content_hash = hashlib.md5(
                            json.dumps({
                                'question': q['question'],
                                'options': q['options'],
                                'correctAnswer': q['correctAnswer']
                            }, sort_keys=True).encode()
                        ).hexdigest()
                        
                        if content_hash not in seen_content:
                            seen_content.add(content_hash)
                            unique_questions.append(q)
                
                app.db.child("cached_questions").child(cache_key).set(unique_questions)
                print(f"Maintained {len(unique_questions)} unique questions for {cache_key}")

@main.route("/pycodeeditor")
def pycodeeditor():
    if session["is_logged_in"]:
        return render_template("pyeditor.html", email=session["username"])
    else:
        return redirect(url_for("main.index"))

@main.route("/py_question", methods=["POST"])
def py_question():
    question = request.get_json().get("question")

    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": f"You are an AI agent for python programming questions for students. Generate python code that the user wants. {question}\n\nIMPORTANT: Always put the programming language before ``` pairs."

            }
        ]
    )

    try:
        response_json = json.loads(response.model_dump_json())

        print(response_json)

        return jsonify({"answer" : response_json["content"][0]["text"]})
        
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        return []

@main.route("/webcodeeditor")
def webcodeeditor():
    if session["is_logged_in"]:
        return render_template("webeditor.html", email=session["username"])
    else:
        return redirect(url_for("main.index"))
    
@main.route("/web_question", methods=["POST"])
def web_question():
    question = request.get_json().get("question")

    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": f"You are an AI agent for web development programming questions for students. Generate web (HTML, CSS, JavaScript) code that the user wants. {question}\n\nIMPORTANT: Always put the programming language before ``` pairs. Always put the language to this: HTML -> html, CSS -> css, JS -> javascript."
            }
        ]
    )

    try:
        response_json = json.loads(response.model_dump_json())

        print(response_json["content"][0])

        return jsonify({"answer" : response_json["content"][0]["text"]})
        
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        return []
    
@main.route("/create_post", methods=["POST"])
def create_post():
    try:
        data = request.json
        content = data.get("content")

        post_data = {
                "content": content,
                "author_id": session["local_id"],
                "author_username": session["username"],
                "timestamp": {".sv": "timestamp"},  # Server timestamp
                "likes": 0,
                "liked_by": {}
            }
        
        post_ref = app.db.child("posts").push(post_data)

        app.db.child("users").child(session["local_id"]).child("posts").child(post_ref["name"]).set(True)
            
        return jsonify({
            "success": True,
            "post_id": post_ref["name"]
        }), 200
    except Exception as e:
        print(f"Error creating post: {str(e)}")
        return jsonify({"success": False, "error": "Error creating post"})

@main.route("/get_posts")
def get_posts():
    try:
        posts = app.db.child("posts").order_by_child("timestamp").limit_to_last(50).get()

        posts_list = []
        for post in posts.each():
            post_data = post.val()
            post_data["id"] = post.key()
            posts_list.append(post_data)

        posts_list.reverse()
        return jsonify({
                "success": True,
                "posts": posts_list
            })
    except Exception as e:
        print(f"Error getting posts: {str(e)}")
        return jsonify({"success": False, "error": "Error getting posts"})

@main.route("/feed")
def feed():
    if session["is_logged_in"]:
        return render_template("feed.html", email=session["username"])
    else:
        return redirect(url_for("main.index"))