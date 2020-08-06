export let socket = io('http://127.0.0.1:5000');

export function init() {
    let roomId = localStorage.getItem('room_id');
    socket.emit('join-game-start', roomId);
}