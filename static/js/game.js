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
            useTheWord(data);
        })
}

function useTheWord(word) {
    document.querySelector('.word').innerHTML = word;
    socket.emit('word-length', {word: word, room_id: localStorage.getItem('room_id')})
}

function addSocketListenerPoints() {
    socket.addEventListener('increase-points', data => {
        let playerDivs = document.querySelectorAll(`.player`);
        for (let playerDiv of playerDivs) {
            if (data['player_id'] === playerDiv.dataset.playerid) {
                playerDiv.querySelector('.points').innerHTML = data['points'];
            }
        }
    })
    socket.addEventListener('word-length', insertHashedWord)
}

function insertHashedWord(number) {
    if (localStorage.getItem('owner_id') !== localStorage.getItem('user_id')) {
        document.querySelector('.word').innerHTML = '_ '.repeat(number);
    }
}