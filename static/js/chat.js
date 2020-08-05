function chatInputField() {
    let inputField = document.querySelector('#chat-input');
    let messageContainer = document.querySelector('.message-container');
    messageContainer.scrollTop = messageContainer.scrollHeight;
    inputField.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault()
            if (inputField.value) {
                let chatMessage = inputField.value
                let chatMessageDiv = `<div class="message">${chatMessage}</div>`
                messageContainer.insertAdjacentHTML('beforeend', chatMessageDiv)
                inputField.value = ''
                messageContainer.scrollTop = messageContainer.scrollHeight;
            }
        }

    })
};

function init() {
    chatInputField()
};

init()