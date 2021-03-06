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
    drawer_name = queries.get_name_by_id(owner_id)
    player_id = queries.insert_new_player(player_name, room_id, avatar)
    join_room(int(room_id))
    response_data = {'room_id': room_id, 'player_id': player_id, 'username': player_name, 'owner_id': owner_id, 'avatar': avatar}
    emit('save-my-id', {'player_id': player_id, 'owner_id': owner_id, 'username': player_name, 'avatar': avatar, 'drawer_name': drawer_name})
    emit('user-joined-room', response_data, broadcast=True, include_self=False)


@socketio.on('ready-to-start')
def init_game_start(room_data):
    room_id = room_data['room_id']
    queries.close_room(int(room_id))
    queries.set_room_params(room_data)
    emit('start-game', room=int(room_id))
    
    
@app.route('/get-players/<room_id>')
def get_players(room_id):
    players_info_in_room = queries.get_players_data(room_id)
    return jsonify(players_info_in_room)


@app.route('/update-drawer', methods=['PUT'])
def update_drawer():
    new_drawer_id = request.get_json()
    queries.update_drawer(new_drawer_id)
    return jsonify("")


@app.route('/get-current-drawer')
def get_current_drawer():
    drawer_info = queries.get_drawer()
    return jsonify(drawer_info)


@socketio.on('join-game-start')
def join_game_start(room_id):
    join_room(room_id)


@socketio.on('drawing')
def drawing(data):
    response = json.loads(data)
    emit('user-draw', json.dumps(response['data']), room=response['roomId'], include_self=False)


@socketio.on('send-chat-message')
def send_chat_message(data):
    message_data = json.loads(data)
    room_id = message_data.pop('room_id')
    emit('new-chat-message', json.dumps(message_data), room=room_id, broadcast=True)


@app.route('/solution/<room_id>')
def get_solution(room_id):
    return jsonify(queries.get_solution(room_id))


@app.route('/get-word')
def get_word():
    room_id = request.args.get("room")
    word_id = request.args.get("word")
    word = queries.get_word(word_id, room_id)
    return jsonify(word)


@socketio.on('update-points')
def update_points(data):
    message_data = json.loads(data)
    room_id = message_data.pop('room_id')
    player_id = message_data.pop('player_id')
    points = queries.update_points(player_id)
    data = {'points': points, 'player_id': player_id}
    emit('increase-points', data, room=room_id)


@socketio.on('word-length')
def send_word_length(data):
    word = data['word']
    room_id = data['room_id']
    length = len(word)
    emit('word-length', length, room=room_id, broadcast=True)


@socketio.on('update-drawer')
def update_drawer(data):
    emit('update-drawer', data['drawerId'], room=data['roomId'])


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
