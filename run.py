from app import create_app
from flask_socketio import SocketIO

app = create_app()
socketio = SocketIO(app)

if __name__ == "__main__":
    socketio.run(app, debug=False, port=8080, host="0.0.0.0", allow_unsafe_werkzeug=True)