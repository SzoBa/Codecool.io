from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit


app = Flask(__name__)
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/game')
def game():
    return render_template('game.html')


@app.route('/room')
def room():
    return render_template('room.html')


if __name__ == '__main__':
    socketio.run(app)

