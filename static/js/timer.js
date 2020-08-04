let timeCounter

function initTimer() {
    timeCounter = setInterval(function (){
    let timerElement = document.querySelector(".time-number")
    let currentTime = parseInt(timerElement.textContent);
        timerElement.textContent = (currentTime - 1).toString()}, 1000)
}


initTimer()