let timeCounter

function gameInit() {
    getGameInfo()
}


function getGameInfo(){
    let drawer = localStorage.getItem("owner_id")
    localStorage.setItem('drawer_id', drawer)
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
    localStorage.setItem('drawing_time', timeLimit)
    setTimerLimit(timeLimit)
    let rounds = data[0]["max_round"]
    localStorage.setItem('max_rounds', rounds)
    localStorage.setItem('current_round', "1")
    initRounds(rounds);
}


function displayPlayers(players){
    let playersContainer =  document.querySelector(".players-container");
    let playersToAdd = ``;
    let smurfCount = 1;
    for (let i = 0; i < players.length;i++){
        let player = players[i];
        let playerInfo = `<div class="player" data-playerid="${player.player_id}">
                        <span class="placement">#${i+1}</span>
                        <div class="player-info">
                            <span class="player-name">${player.name}</span>
                            <span class="points">${player.points}</span>
                        </div>
                        <span><img src="static/avatars/smurf_${smurfCount}.png" width="40" height="40"></span>
                        </div>`
        playersToAdd += playerInfo;
        if (smurfCount < 20) {
            smurfCount++;
        } else {
            smurfCount = 0
        }
    }
    playersContainer.innerHTML = playersToAdd
}

function setTimerLimit(timeLimit) {
    //gets drawing time from db and sets the timer accordingly
    document.querySelector(".time-number").textContent = timeLimit
}

function displayDrawer() {
    let drawer = localStorage.getItem("username")
    let modal = document.querySelector(".modal");
    let modalTextContainer = document.querySelector("#modal-text-container");
    modalTextContainer.innerHTML = `${drawer} is drawing. GET READY!`
    modal.style.display = "block";
    setTimeout(function () {
        modal.style.display = "none";
    }, 3000);
}

function initTimer() {
    //this function is the countdown for the timer
    displayDrawer();
    setTimeout(function () {
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
        // this adds the animations to the clock
        timerElement.classList.add("time-running-out");
        timerElement.classList.add("shake");
        clock.classList.add("shake");
    }
    timerElement.textContent = (currentTime - 1).toString()}, 1000);
    }, 3000)

}


function initRounds(rounds) {
    // gets max rounds from db
    let roundsContainer = document.querySelector(".empty"); // class name needs to be updated
    roundsContainer.dataset.currentRound = 1;
    roundsContainer.dataset.maxRounds = rounds;
    roundsContainer.innerText = `Round 1 of ${rounds}`;
}

function changeCurrentRound () {
    //updates the number of rounds displayed in top left corner
    let endRound = document.querySelector(".empty").dataset.currentRound; // class name needs to be updated
    let maximumRounds = document.querySelector(".empty").dataset.maxRounds; // class name needs to be updated
    let currentRound = parseInt(endRound) + 1;
    endRound = currentRound;
    let newRound = document.querySelector(".empty");// class name needs to be updated
    newRound.textContent = `Round ${endRound} of ${maximumRounds}`
    localStorage.setItem('current_round', endRound.toString());

}

function switchDrawer(){
    let currentDrawerId = localStorage.getItem("drawer");
    let nextDrawerId = getNextDrawerId(currentDrawerId)
    let myId = localStorage.getItem("user_id");
    if (currentDrawerId === myId){
        fetch("/update-drawer", {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nextDrawerId)
        })
    }
}


function getNextDrawerId(currentDrawerId){
    let newDrawerId
    let drawerSearch = true
    let foundDrawer = false
    let players = document.querySelectorAll(".player")
    while (drawerSearch){
        for (let player of players){
            if (foundDrawer) {
                newDrawerId =  player.dataset.playerid
                drawerSearch = false
            } else if (player.dataset.playerid = currentDrawerId){
                foundDrawer = true
            }
        }
    }
    return newDrawerId
}

function updateCurrentDrawer(){
    fetch('/get-current-drawer', {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json_response => storeInfo(json_response));
}

function storeInfo(drawerInfo){
    localStorage.setItem("drawer_id", drawerInfo.id)
    localStorage.setItem("drawer_name", drawerInfo.name)
}



gameInit()