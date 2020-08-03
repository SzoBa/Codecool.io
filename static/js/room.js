init();

function init() {
    let socket = io('http://127.0.0.1:5000')
    addSocketConnectionListeners(socket);
    addListenerToButton(socket);
    addSocketListenerCreatedRoom(socket);
}

function addSocketConnectionListeners(socket) {
    socket.addEventListener('connect', () => {
        console.log('we are connected to server')
    });
    socket.addEventListener('close', () => {
        console.log('connection closed')
    })

}

function addListenerToButton(socket) {
    let button = document.querySelector('#username_button')
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

function addSocketListenerCreatedRoom(socket) {
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
        let creatorData = event['username'];
        console.log(event)
        localStorage['player_id'] = event.player_id;
        let roomInnerDiv = document.querySelector('#room_div_inner');
        roomInnerDiv.innerHTML = ""
        let createTable = `
        <button id="join_room_button" data-creator=${creatorData}>Join Room</button>`
        roomInnerDiv.insertAdjacentHTML('beforeend', createTable);
        document.querySelector('#join_room_button').addEventListener('click', joinRoom);
    })
}

function createRoom() {

}

function joinRoom(event) {
    console.log(event.target.dataset.creator);

}