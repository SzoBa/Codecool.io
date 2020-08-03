init();

function init() {
    let socket = io('http://127.0.0.1:5000')
    socket.addEventListener('connect', (event) => {
        console.log('we are connected to server')
    });
    socket.addEventListener('close', (event) => {
        console.log('connection closed')
    })
}


// username: key - name