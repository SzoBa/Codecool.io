let timeCounter

function gameInit() {
    initTimer()
    getPlayers()

}

function initTimer() {
    timeCounter = setInterval(function (){
    let clock = document.querySelector("#clock-img");
    let timerElement = document.querySelector(".time-number");
    let currentTime = parseInt(timerElement.textContent);
    if (currentTime <= 1){
        //the round ends
        clearInterval(timeCounter);
        timerElement.classList.remove("time-running-out");
        timerElement.classList.remove("shake");
        clock.classList.remove("shake")
    }else if (currentTime <= 10){
        timerElement.classList.add("time-running-out");
        timerElement.classList.add("shake");
        clock.classList.add("shake");
    }
    timerElement.textContent = (currentTime - 1).toString()}, 1000);
}

function getPlayers(){
    let room_id = localStorage.getItem('room_id')
    let url =  "get-players/" + room_id
    fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json_response => displayPlayers(json_response));
}

function displayPlayers(players){
    console.log(players)
}


gameInit()