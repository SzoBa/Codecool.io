let timeCounter

function gameInit() {
    getGameInfo()
    initTimer()
    initRounds()
}


function getGameInfo(){
    let room_id = localStorage.getItem('room_id')
    let url =  "/get-players/" + room_id
    fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json_response => initGameFlow(json_response));
}


function initGameFlow(data){
    displayPlayers(data)
    let timeLimit = data[0]["drawing_time"]
    setTimerLimit(timeLimit)
    let rounds = data[0]["max_round"]
    initRounds(rounds);

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
    let rounds = players[0]["max_round"]
    initRounds(rounds);
}

function setTimerLimit(timeLimit) {
    document.querySelector(".time-number").textContent = timeLimit
}

function initTimer() {
    timeCounter = setInterval(function (){
    let clock = document.querySelector("#clock-img");
    let timerElement = document.querySelector(".time-number");
    let currentTime = parseInt(timerElement.textContent);
    if (currentTime <= 1){
        //the round ends here
        clearInterval(timeCounter);
        changeCurrentRound();  //this function changes the rounds - needs to be moved once round changes are decided
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


function initRounds(rounds) {
    let roundsContainer = document.querySelector(".empty"); // class name needs to be updated
    roundsContainer.dataset.currentRound = 1;
    roundsContainer.dataset.maxRounds = rounds;
    roundsContainer.innerText = `Round 1 of ${rounds}`;
}

function changeCurrentRound () {
    let endRound = document.querySelector(".empty").dataset.currentRound; // class name needs to be updated
    let maximumRounds = document.querySelector(".empty").dataset.maxRounds; // class name needs to be updated
    let currentRound = parseInt(endRound) + 1;
    endRound = currentRound;
    let newRound = document.querySelector(".empty");
    newRound.textContent = `Round ${endRound} of ${maximumRounds}`
}

gameInit()