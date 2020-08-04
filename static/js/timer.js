let timeCounter

function gameInit() {
    getGameInfo()
    initTimer()

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

function getGameInfo(){
    let room_id = localStorage.getItem('room_id')
    let url =  "/get-players/" + room_id
    fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json_response => displayPlayers(json_response));
}

function displayPlayers(players){
    let playersContainer =  document.querySelector(".players-container");
    let playersToAdd = ``;
    let smurfCount = 1;
    for (let i = 0; i < players.length;i++){
        let player = players[i];
        let playerInfo = `<div class="player">
                        <span class="placement">#${i+1}</span>
                        <div class="player-info">
                            <span class="player-name">${player.name}</span>
                            <span class="points">${player.points}</span>
                        </div>
                        <span><img src="static/avatars/smurf_${smurfCount}.png" width="40" height="40"></span>
                        </div>`
        playersToAdd += playerInfo;
        if (smurfCount < 20) {smurfCount++};
    }
    playersContainer.innerHTML = playersToAdd
    let timeLimit = players[0]["drawing_time"]
    setTimerLimit(timeLimit)
}

function setTimerLimit(timeLimit) {
    document.querySelector(".time-number").textContent = timeLimit
}

gameInit()