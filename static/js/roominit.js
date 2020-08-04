function init() {
    loadRooms()

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
        if (room.is_open === 'false') {
            section = document.querySelector('#playing_room')
            let newRoomContent = `<div class="room" data-room="${room.room_id}">
                    <p>Players:</p>
                    <ul>
                        ${playersHtml}
                    </ul>
                </div>`
            section.insertAdjacentHTML("beforeend", newRoomContent);
        } else if (room.owner_id === localStorage.player_id) {
            section = document.querySelector('#playing_room')
            let newRoomContent = `<div class="room" data-room="${room.room_id}">
                    <p>Players:</p>
                    <ul>
                        ${playersHtml}
                    </ul>
                </div>
                <div id="start_game" class=""><button>START GAME</button></div>`
            section.insertAdjacentHTML("beforeend", newRoomContent);
        } else {
            section = document.querySelector('#playing_room')
            let newRoomContent = `<div class="room" data-room="${room.room_id}">
                    <p>Players:</p>
                    <ul>
                        ${playersHtml}
                    </ul>
                <input id="username" required>
                <button id="join_room_button" data-creator=${ room.owner_id }>Join Room</button>
                </div>`
            section.insertAdjacentHTML("beforeend", newRoomContent);
        }
    }

}

init();