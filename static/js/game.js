import {socket} from './socket.js'

init();

function init() {
    if (localStorage.getItem('drawer_id') === localStorage.getItem('user_id')) {
        getWord();
    }
    addSocketListenerPoints();
}

export function getWord() {
    let wordNumber = Math.floor(Math.random() * 6801) + 1;
    let roomId = localStorage.getItem('room_id');
    let url = '/get-word';
    fetch(`${url}?word=${wordNumber}&room=${roomId}`)
        .then((response) => response.json())
        .then(data => {
            useTheWord(data);
        })
}

export function useTheWord(word) {
    document.querySelector('.word').innerHTML = word;
    socket.emit('word-length', {word: word, room_id: localStorage.getItem('room_id')})
}

function addSocketListenerPoints() {
    let playerId = localStorage.getItem('player_id');
    socket.addEventListener('increase-points', data => {
        let playerDiv = document.querySelector(`[data-playerid=${playerId}]`);
        playerDiv.querySelector('.points').innerHTML = data;
    })
    socket.addEventListener('word-length', insertHashedWord)
}

function insertHashedWord(number) {
    if (localStorage.getItem('drawer_id') !== localStorage.getItem('user_id')) {
        document.querySelector('.word').innerHTML = '_ '.repeat(number);
    }
}