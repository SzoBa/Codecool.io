import {socket} from './socket.js'

init();

function init() {
    chatInputField();
    chatSocketSetup();
}

function chatInputField() {
    if (localStorage.user_id !== localStorage.owner_id) {
        let inputField = document.querySelector('#chat-input');
        let messageContainer = document.querySelector('.message-container');
        messageContainer.scrollTop = messageContainer.scrollHeight;
        inputField.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                event.preventDefault()
                let chatMessage = inputField.value
                let roomId = localStorage.getItem('room_id');
                checkGuess(roomId, chatMessage)
            }
        })
    }
}

function chatSocketSetup() {
    socket.addEventListener('new-chat-message', (data)=> {
        let messageData = JSON.parse(data);
        let messageContainer = document.querySelector('.message-container');
        let chatMessageDiv = `<div class="message">${messageData['username']}: ${messageData['message']}</div>`
        messageContainer.insertAdjacentHTML('beforeend', chatMessageDiv);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    })
}

function checkGuess(roomId, message) {
    fetch(`/solution/${roomId}`)
        .then(response => response.json())
        .then(solution => compareGuess(solution, message))
}

function compareGuess(solution, message) {
    if (solution.toLowerCase() === message.toLowerCase()) {
        let data = {
            message: chatMessage,
            username: localStorage.getItem('username'),
            room_id: roomId
        }
        socket.emit('send-chat-message', JSON.stringify(data));
        inputField.value = ''
    } else {
    }
}
