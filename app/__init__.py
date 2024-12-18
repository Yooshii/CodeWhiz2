from flask import Flask
import pyrebase
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flask_session import Session

fb_api_key = os.getenv("FBAPIKEY")
db_url = os.getenv("DATABASEURL")

firebaseConfig = {
    "apiKey" : fb_api_key,
    "authDomain" : "emovie-22d92.firebaseapp.com",
    "projectId" : "emovie-22d92",
    "storageBucket" : "emovie-22d92.appspot.com",
    "messagingSenderId" : "76805579553",
    "appId" : "1:76805579553:web:5b41fdbcb59dcae5159460",
    "databaseURL" : db_url 
}

def create_app():
    app = Flask(__name__, static_folder="static", static_url_path="")

    app.secret_key = "emovie"
    fb = pyrebase.initialize_app(firebaseConfig)
    app.auth = fb.auth()
    app.db = fb.database()

    from .routes import main
    
    app.register_blueprint(main)

    return app