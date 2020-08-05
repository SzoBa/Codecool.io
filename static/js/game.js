import {socket} from './socket.js'

init();

function init() {
    if (localStorage.getItem('owner_id') === localStorage.getItem('user_id')) {
        getWord();
    }
    addSocketListenerPoints();
}

function getWord() {
    let wordNumber = Math.floor(Math.random() * 6801) + 1;
    let roomId = localStorage.getItem('room_id');
    let url = '/get-word';
    fetch(`${url}?word=${wordNumber}&room=${roomId}`)
        .then((response) => response.json())
        .then(data => {
            console.log(data);
            useTheWord(data);
        })
}

function useTheWord(word) {
    console.log(word)
    document.querySelector('.word').innerHTML = word;
}

function addSocketListenerPoints() {
    let playerId = localStorage.getItem('player_id');
    socket.addEventListener('increase-points', data => {
        let playerDiv = document.querySelector(`[data-playerid=${playerId}]`);
        playerDiv.querySelector('.points').innerHTML = data;
    })
}