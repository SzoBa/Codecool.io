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
    avatar = data['avatar']
    room_id = queries.insert_new_room()
    player_id = queries.insert_new_player(player_name, room_id, avatar, is_drawer=True)
    queries.insert_owner_id_to_room(player_id, room_id)
    join_room(room_id)
    response_data = {'room_id': room_id, 'player_id': player_id, 'username': player_name, 'avatar': avatar}
    emit('own-room-created', response_data)
    emit('new-room-created', response_data, broadcast=True, include_self=False)


@socketio.on('join-room')
def join_to_room(data):
    player_name = data['username']
    room_id = data['room_id']
    owner_id = data['owner_id']
    avatar = data['avatar']
    player_id = queries.insert_new_player(player_name, room_id, avatar)
    join_room(int(room_id))
    response_data = {'room_id': room_id, 'player_id': player_id, 'username': player_name, 'owner_id': owner_id, 'avatar': avatar}
    emit('save-my-id', {'player_id': player_id, 'owner_id': owner_id, 'username': player_name, 'avatar': avatar})
    emit('user-joined-room', response_data, broadcast=True, include_self=False)


@socketio.on('ready-to-start')
def init_game_start(room_id):
    queries.close_room(int(room_id))
    emit('start-game', room=int(room_id))


@app.route('/get-rooms')
def get_rooms():
    rooms = queries.get_rooms()
    return jsonify(rooms)


@socketio.on('create-existing-room')
def create_existing_room(room_id):
    join_room(room_id)


@socketio.on('refresh-image')
def refresh_image(data):
    user_id = data['userId']
    current_image = data['currentImage']
    queries.refresh_image(user_id, current_image)
    response_data = {'user_id': user_id, 'current_image': current_image}
    emit('refresh_user_image', response_data, broadcast=True, include_self=True)


@app.route('/get-avatar')
def get_avatar():
    user_id = request.args['user_id']
    if user_id != 'undefined':
        avatar = queries.get_avatar(user_id)
        if avatar:
            avatar_number = avatar['avatar'].split('_')[1].split('.')[0]
            return jsonify(avatar_number)
    return jsonify(1)


@app.route('/get-username')
def get_username():
    user_id = request.args.get('user_id', None)
    if user_id and user_id != 'undefined':
        username = queries.get_username(user_id)
        return jsonify(username)
    return jsonify('')


if __name__ == '__main__':
    socketio.run(app)
