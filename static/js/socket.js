export let socket = io('https://thawing-castle-91338.herokuapp.com');

export function init() {
    let roomId = localStorage.getItem('room_id');
    socket.emit('join-game-start', roomId);
}