from flask import Flask, render_template, url_for, request, redirect, session, jsonify, json, flash
from flask_socketio import SocketIO, join_room, leave_room, emit


app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)


@app.route('/')
@app.route('/room')
def room():
    return render_template('room.html')


@app.route('/game')
def game():
    return render_template('game.html')


if __name__ == '__main__':
    socketio.run(app)

