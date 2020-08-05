let socket = io('http://127.0.0.1:5000');
let slideIndex = 1;
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
    });
    socket.addEventListener('save-my-id', (data) => {
        localStorage.setItem('user_id', data.player_id)
        localStorage.setItem('owner_id', data.owner_id)
    });
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
                createUserProfile(username)
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
        console.log(event)
        localStorage['user_id'] = event.player_id;
        localStorage['owner_id'] = event.player_id;
        localStorage['room_id'] = event.room_id;
        document.querySelector('#room_div').classList.add('display-none');
        let currentRoom = document.querySelector('#current_room');
        let createdRoom = `
        <div class="room" data-room="${event.room_id}">
        <p>Room (number: ${event.room_id})</p>
        <p>Players:</p>
        <ul></ul></div>`
        currentRoom.insertAdjacentHTML('beforeend', createdRoom);
        let startButton = `<div id="start_game" class=""><button>START GAME</button></div>`
        currentRoom.insertAdjacentHTML("beforeend", startButton);
        let player = `<li>${event.username}</li>`
        document.querySelector('.room ul').insertAdjacentHTML('beforeend', player);
        document.querySelector('#start_game').addEventListener('click', (event) => {
            let roomData = event.target.closest('#current_room').querySelector('.room').dataset.room;
            socket.emit('ready-to-start', roomData);
        });
    });
    socket.addEventListener('new-room-created', (event) => {
        //it receives the creator's data
        let creatorName = event['username'];
        let creatorId = event['player_id'];
        let roomId = event['room_id'];
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
    });
    socket.addEventListener('user-joined-room', (event) => {
        let player = `<li>${event.username}</li>`
        document.querySelector('.room ul').insertAdjacentHTML('beforeend', player);

    });
    socket.addEventListener('start-game', (event) => {
        window.location.replace('/game');
    });
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
        createUserProfile(username)
    }

};

function createUserProfile(userName) {
    let userProfile = `
    <p id="user-name">Username: ${userName}</p>
    <div class="user-avatar-container">
        <img class="avatar-slide" src="/static/avatars/smurf_1.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_2.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_3.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_4.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_5.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_6.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_7.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_8.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_9.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_10.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_11.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_12.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_13.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_14.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_15.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_16.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_17.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_18.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_19.png" height="150" width="150">
        <img class="avatar-slide" src="/static/avatars/smurf_20.png" height="150" width="150">
        <button class="avatar-slide-button" data-slide="-1">Left</button>
        <button class="avatar-slide-button" data-slide="1">Right</button>
    </div>`
    let profileContainer = document.querySelector('.profile')
    profileContainer.insertAdjacentHTML('beforeend', userProfile)
    showSlideAvatars(slideIndex)
    slideButtonsEvent()
};

function slideButtonsEvent() {
    let slideButtons = document.querySelectorAll('.avatar-slide-button')
    for (let slideButton of slideButtons) {
        slideButton.addEventListener('click', function (event) {
        let slideData = parseInt(slideButton.dataset.slide) + slideIndex
        showSlideAvatars(slideData)
        })
    }
}

function showSlideAvatars(n) {
    slideIndex = n;
    let x = document.getElementsByClassName("avatar-slide");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex-1].style.display = "block";
}
