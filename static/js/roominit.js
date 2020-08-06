export let socket = io('http://fast-sierra-80105.herokuapp.com/');
// import {joinRoom} from "./room.js";

function init() {
    createSocketRooms();
    loadRooms()

}

function createSocketRooms() {
    socket.emit('create-existing-room', localStorage['room_id']);
}

function loadRooms() {
    fetch('get-rooms')
        .then(response => response.json())
        .then(data => displayRooms(data))
}

function displayRooms(rooms) {
    let section;
    for (let room of rooms) {
        let players = room.player_name.split(',')
        let playersHtml = '';
        for (let player of players) {
            playersHtml += `<li>${player}</li>`
        }
        if (room.is_open === false) {
            section = document.querySelector('#playing_room')
            let newRoomContent = `<div class="room" data-room="${room.room_id}">
                    <p>Players:</p>
                    <ul>
                        ${playersHtml}
                    </ul>
                </div>`
            section.insertAdjacentHTML("beforeend", newRoomContent);
        } else if (parseInt(room['owner_id']) === parseInt(localStorage.user_id)) {
            section = document.querySelector('#current_room')
            let newRoomContent = `<div class="room" data-room="${room.room_id}">
                    <p>Players:</p>
                    <ul>
                        ${playersHtml}
                    </ul>
                </div>
                <div id="start_game" class=""><button>START GAME</button></div>`
            section.insertAdjacentHTML("beforeend", newRoomContent);
            let startButton = document.querySelector('#start_game');
            startButton.addEventListener('click', (event) => {
                let roomData = event.target.closest('#current_room').querySelector('.room').dataset.room;
                socket.emit('ready-to-start', roomData);
            });
        } else {
            section = document.querySelector('#waiting_room')
            let newRoomContent = `<div class="room" data-room="${room.room_id}">
                    <p>Players:</p>
                    <ul>
                        ${playersHtml}
                    </ul>
                <input id="username" required>
                <button id="join_room_button" data-creator=${room.owner_id}>Join Room</button>
                </div>`
            section.insertAdjacentHTML("beforeend", newRoomContent);
            document.querySelector('#join_room_button').addEventListener('click', joinRoom);
        }
    }

}

function joinRoom(event) {
    let username = document.querySelector('#username').value;
    let roomId = event.target.closest('div').dataset.room;
    localStorage['room_id'] = roomId;
    let ownerId = event.target.closest('div').querySelector('#join_room_button').dataset.creator;
    if (username) {
        localStorage['username'] = username;
        let userdata = {'username': username, 'room_id': roomId, 'owner_id': ownerId};
        socket.emit('join-room', userdata);
        this.closest('div').querySelector('input').remove();
        this.remove();
        document.querySelector('.room ul').insertAdjacentHTML('beforeend', `<li>${username}</li>`);
    }

}


init();