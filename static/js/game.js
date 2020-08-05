import {socket} from './socket.js'

init();

function init() {
    if (localStorage.getItem('owner_id') === localStorage.getItem('player_id')) {
        getWord();
    }
}

function getWord() {
    let wordNumber = Math.floor(Math.random() * 6801) + 1;
    let roomId = localStorage.getItem('room_id');
    let data = {word_number: wordNumber, room_id: roomId}
    let url = '/get-word';
    fetch(`${url}?data=${data}`)
        .then((response) => response.json())
        .then(data => {
            useTheWord(data);
        })
}

function useTheWord(word) {
    console.log(word)
}