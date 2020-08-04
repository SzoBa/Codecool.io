export let socket = io('http://127.0.0.1:5000');

init();

function init() {
    let roomId = localStorage.getItem('room_id');
    socket.emit('join-game-start', roomId);

    socket.addEventListener('alert', ()=> {
        console.log('ngego');
    })
}