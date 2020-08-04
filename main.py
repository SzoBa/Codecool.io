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
    existing_room = queries.get_existing_room()
    players, existing_room_id, owner_id = None, None, None
    if existing_room:
        players = [record['player_name'] for record in existing_room]
        existing_room_id = existing_room[0]['room_id']
        owner_id = existing_room[0]['player_id']
    return render_template('room.html', room_id=existing_room_id, players=players, owner_id=owner_id)

  
@app.route('/game')
def game():
  return render_template('game-page.html')


@socketio.on('create-room')
def create_room(data):
    player_name = data['username']
    room_id = queries.insert_new_room()
    player_id = queries.insert_new_player(player_name, room_id, is_drawer=True)
    join_room(room_id)
    response_data = {'room_id': room_id, 'player_id': player_id, 'username': player_name}
    emit('own-room-created', response_data)
    emit('new-room-created', response_data, broadcast=True, include_self=False)


@socketio.on('join-room')
def join_to_room(data):
    player_name = data['username']
    room_id = data['room_id']
    owner_id = data['owner_id']
    player_id = queries.insert_new_player(player_name, room_id)
    join_room(int(room_id))
    response_data = {'room_id': room_id, 'player_id': player_id, 'username': player_name, 'owner_id': owner_id}
    emit('save-my-id', {'player_id': player_id, 'owner_id': owner_id})
    emit('user-joined-room', response_data, broadcast=True, include_self=False)


@socketio.on('ready-to-start')
def init_game_start(room_id):
    queries.close_room(room_id)
    emit('start-game', room=int(room_id))


@socketio.on('join-game-start')
def join_game_start(room_id):
    join_room(room_id)


@socketio.on('drawing')
def drawing(data):
    response = json.loads(data)
    print(response['roomId'])
    emit('user-draw', jsonify(response['data']), room=int(response['roomId']), include_self=False)


if __name__ == '__main__':
    socketio.run(app)
