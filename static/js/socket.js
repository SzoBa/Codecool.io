export let socket = io('http://fast-sierra-80105.herokuapp.com/');

export function init() {
    let roomId = localStorage.getItem('room_id');
    socket.emit('join-game-start', roomId);
}