let socket = io('http://127.0.0.1:5000');
init();

function init() {

    addSocketConnectionListeners();
    addListenerToButton();
    addSocketListenerCreatedRoom();
}

function addSocketConnectionListeners() {
    socket.addEventListener('connect', () => {
        console.log('we are connected to server')
    });
    socket.addEventListener('close', () => {
        console.log('connection closed')
    })

}

function addListenerToButton() {
    let button = document.querySelector('#username_button')
    if (button) {
        button.addEventListener('click', () => {
            let username = document.querySelector('#username').value;
            if (username) {
                localStorage['username'] = username;
                //get room data if not exists - create, else join (or both - later)
                let userdata = {'username': username};
                socket.emit('create-room', userdata);
            }
        })
    }
    let joinButton = document.querySelector('#join_room_button');
    if (joinButton) {
        joinButton.addEventListener('click', joinRoom)
    }
}

function addSocketListenerCreatedRoom() {
    socket.addEventListener('own-room-created', (event) => {
        localStorage['player_id'] = event.player_id;
        document.querySelector('#room_div').classList.add('display-none');
        // let roomInnerDiv = document.querySelector('#room_div_inner');
        // roomInnerDiv.innerHTML = ""
        // let createTable = `
        // <button id="create_room_button">Create Room</button>`
        // roomInnerDiv.insertAdjacentHTML('beforeend', createTable);
        // document.querySelector('#create_room_button').addEventListener('click', createRoom);
        //she/he is already in the room, no need for create button here
    })
    socket.addEventListener('new-room-created', (event) => {
        //it receives the creator's data
        let creatorName = event['username'];
        let creatorId = event['player_id'];
        let roomId = event['room_id'];
        console.log(event)
        localStorage['player_id'] = event.player_id;

        let waitingRoom = document.querySelector('#waiting_room');
        let newRoom = document.createElement('div');
        newRoom.classList.add('room');
        newRoom.dataset.room = `${roomId}`;
        newRoom.innerHTML = `<p>Players:</p>
                             <ul><li>${creatorName}</li></ul>
                             <input id="username" required>
                             <button id="join_room_button" data-creator=${creatorId}>Join Room</button>`;
        waitingRoom.appendChild(newRoom);
        document.querySelector('#join_room_button').addEventListener('click', joinRoom);

        let roomInnerDiv = document.querySelector('#room_div');
        roomInnerDiv.classList.add('display-none');
        roomInnerDiv.remove();
    })
}

function createRoom() {

}

function joinRoom(event) {
    let username = document.querySelector('#username').value;
    let roomId = event.target.closest('div').dataset.room;
    let ownerId = event.target.closest('div').querySelector('#join_room_button').dataset.creator;
    if (username) {
        localStorage['username'] = username;
        //get room data if not exists - create, else join (or both - later)
        let userdata = {'username': username, 'room_id': roomId, 'owner_id': ownerId};
        socket.emit('join-room', userdata);
    }

}