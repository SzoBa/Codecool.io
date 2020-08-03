from flask import Flask, render_template, url_for, request, redirect, session, jsonify, json, flash
from flask_socketio import SocketIO, join_room, leave_room, emit
import json
import queries


app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)


@app.route('/')
@app.route('/room')
def room():
    return render_template('room.html')


@socketio.on('create-room')
def create_room(data):
    player_name = data['username']
    room_id = queries.insert_new_room()
    player_id = queries.insert_new_player(player_name, room_id)
    join_room(room_id)
    response_data = {'room_id': room_id, 'player_id': player_id, 'username': player_name}
    emit('own-room-created', response_data)
    emit('new-room-created', response_data, broadcast=True, include_self=False)


@app.route('/game')
def game():
    return render_template('game.html')


if __name__ == '__main__':
    socketio.run(app)

