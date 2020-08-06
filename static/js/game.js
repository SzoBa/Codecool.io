import {socket} from './socket.js'

// init();

export function init() {
    addSocketListenerPoints();
    if (localStorage.getItem('drawer_id') === localStorage.getItem('user_id')) {
        getWord();
    }
}

export async function getWord() {
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
    console.log(word)
    console.log('getWord')
    document.querySelector('.word').innerHTML = word;
    socket.emit('word-length', {word: word, room_id: localStorage.getItem('room_id')})
}

export function addSocketListenerPoints() {
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
    if (localStorage.getItem('drawer_id') !== localStorage.getItem('user_id')) {
        document.querySelector('.word').innerHTML = '_ '.repeat(number);
    }
}