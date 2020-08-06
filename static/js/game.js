import {socket} from './socket.js'

// init();

export function init() {
    addSocketListenerPoints();
    if (localStorage.getItem('drawer_id') === localStorage.getItem('user_id')) {
        getWord();
    }
}

export async function getWord() {
    let wordNumber = Math.floor(Math.random() * 46) + 1;
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

export function addSocketListenerPoints() {
    socket.addEventListener('increase-points', data => {
        let playerDivs = document.querySelectorAll(`.player`);
        for (let playerDiv of playerDivs) {
            if (data['player_id'] === playerDiv.dataset.playerid) {
                playerDiv.querySelector('.points').innerHTML = data['points'];
            }
        }
        updateOrder();
    })
    socket.addEventListener('word-length', insertHashedWord)
}

function insertHashedWord(number) {
    if (localStorage.getItem('drawer_id') !== localStorage.getItem('user_id')) {
        document.querySelector('.word').innerHTML = '_ '.repeat(number);
    }
}

function updateOrder() {
    let pointContainers = [...document.querySelectorAll('.points')];
    let points = [];
    for (let container of pointContainers) {
        points.push([parseInt(container.innerHTML), parseInt(container.closest('.player').dataset.playerid)]);
    }
    points.sort(function (a, b) {
        if (a[0] > b[0]) {
            return -1;
        } else {
            return 1;
        }
    });
    let placeContainers = [...document.querySelectorAll('.placement')];
    for (let i = 0; i < points.length; i++) {
        for (let container of placeContainers) {
            if (parseInt(container.closest('.player').dataset.playerid) === points[i][1])
                container.innerHTML = `#${(i + 1).toString()}`;
        }
    }
}