init();

function init() {
    addSocket();
    addListenerToButton();
}


// username: key - name

function addSocket() {
    let socket = io('http://127.0.0.1:5000')
    socket.addEventListener('connect', (event) => {
        console.log('we are connected to server')
    });
    socket.addEventListener('close', (event) => {
        console.log('connection closed')
    })

}

function addListenerToButton() {
    let button = document.querySelector('#username_button')
    button.addEventListener('click', () => {
        let username = document.querySelector('#username').value;
        localStorage['username'] = username;
        let userdata = {'username': username};
        socket.emit('create-room', userdata);
    })

}