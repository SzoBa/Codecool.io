let timeCounter

function initTimer() {
    timeCounter = setInterval(function (){
    let clock = document.querySelector("#clock-img");
    let timerElement = document.querySelector(".time-number");
    let currentTime = parseInt(timerElement.textContent);
    if (currentTime <= 1){
        //the round ends
        clearInterval(timeCounter);
        timerElement.classList.remove("blinking");
        timerElement.classList.remove("shake");
        clock.classList.remove("shake")
    }else if (currentTime <= 10){
        timerElement.classList.add("blinking");
        timerElement.classList.add("shake");
        clock.classList.add("shake");
    }
    timerElement.textContent = (currentTime - 1).toString()}, 1000);
}



initTimer()