init();

function init() {
    let socket = io('http://127.0.0.1:5000')
    socket.addEventListener('connect', (event) => {
        console.log('we are connected to server')
    });
    socket.addEventListener('close', (event) => {
        console.log('connection closed')
    })

    addListenerToButton(socket);
    addSocketListenerCreatedRoom(socket);
}


function addListenerToButton(socket) {
    let button = document.querySelector('#username_button')
    button.addEventListener('click', () => {
        let username = document.querySelector('#username').value;
        localStorage['username'] = username;
        let userdata = {'username': username};
        socket.emit('create-room', userdata);
    })

}

function addSocketListenerCreatedRoom(socket) {
    socket.addEventListener('own-room-created', (event) => {
        console.log(event);
        localStorage['player_id'] = event.player_id;
        let roomDiv = document.querySelector('#room_div');
        roomDiv.innerHTML = ""
        let createTable = `
        <button>Create Room</button>`
        roomDiv.insertAdjacentHTML('beforeend', createTable);

    })
    socket.addEventListener('new-room-created', (event) => {
        localStorage['player_id'] = event.player_id;
        let roomDiv = document.querySelector('#room_div');
        roomDiv.innerHTML = ""
        let createTable = `
        <button>Join Room</button>`
        roomDiv.insertAdjacentHTML('beforeend', createTable);

    })
}