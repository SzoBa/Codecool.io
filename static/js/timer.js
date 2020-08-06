import {socket} from './socket.js'
import * as canvas from './canvas.js'
import * as game from './game.js'

let timeCounter

export async function gameInit() {
    socket.addEventListener('update-drawer', function () {
        updateCurrentDrawer();
    })
    if (localStorage.getItem('drawer_id') === localStorage.getItem('user_id')) {
        await game.getWord();
    }
    await getGameInfo()
    initTimer()
}


async function getGameInfo(){
    let drawer = localStorage.getItem("owner_id")
    localStorage.setItem('drawer_id', drawer)
    // fetch('/get-current-drawer')
    //     .then(response => response.json())
    //     .then(data => localStorage.setItem('drawer_name', data.name))
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

function roundChangeGameFlow(){
    let endRound = document.querySelector(".empty").dataset.currentRound;
    let maximumRounds = document.querySelector(".empty").dataset.maxRounds;
    let time = localStorage.getItem('drawing_time')
    setTimerLimit(time)
    clearInterval(timeCounter);
    if (endRound <= maximumRounds) {
        initTimer(true)
    } else {
        theEnd();
    }
}


function displayPlayers(players){
    let playersContainer =  document.querySelector(".players-container");
    let playersToAdd = ``;
    for (let i = 0; i < players.length;i++){
        let player = players[i];
        let playerInfo = `<div class="player" data-playerid="${player.player_id}">
                        <span class="placement">#${i+1}</span>
                        <div class="player-info">
                            <span class="player-name">${player.name}</span>
                            <span class="points">${player.points}</span>
                        </div>
                        <span><img src="static/avatars/${player.avatar}" width="40" height="40"></span>
                        </div>`
        playersToAdd += playerInfo;
    }
    playersContainer.innerHTML = playersToAdd
}

function setTimerLimit(timeLimit) {
    //gets drawing time from db and sets the timer accordingly
    document.querySelector(".time-number").textContent = timeLimit
}

function displayDrawer() {
    let drawer = localStorage.getItem("drawer_name")
    let modal = document.querySelector(".modal");
    let modalTextContainer = document.querySelector("#modal-text-container");
    modalTextContainer.innerHTML = `${drawer} is drawing. GET READY!`
    modal.style.display = "block";
    setTimeout(function () {
        modal.style.display = "none";
    }, 3000);
}

function initTimer(roundChange=false) {
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
        timerElement.classList.remove("time-running-out");
        timerElement.classList.remove("shake");
        clock.classList.remove("shake")
        currentTime = parseInt(timerElement.textContent);
        changeCurrentRound();
        //this function changes the rounds - needs to be moved once round changes are decided
    }else if (currentTime <= 10){
        // this adds the animations to the clock
        timerElement.classList.add("time-running-out");
        timerElement.classList.add("shake");
        clock.classList.add("shake");
    }
    if (roundChange){
        currentTime = parseInt(localStorage.getItem("drawing_time"))
        roundChange = false
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

function changeCurrentRound() {
    //updates the number of rounds displayed in top left corner
    let players = document.querySelectorAll('.player');
    let lastPlayerId = players[players.length - 1].dataset.playerid;
    if (localStorage.getItem('drawer_id') === lastPlayerId) {
        let endRound = document.querySelector(".empty").dataset.currentRound; // class name needs to be updated
        let maximumRounds = document.querySelector(".empty").dataset.maxRounds; // class name needs to be updated
        let currentRound = parseInt(endRound) + 1;
        document.querySelector(".empty").dataset.currentRound = currentRound.toString();
        let newRound = document.querySelector(".empty");// class name needs to be updated
        newRound.textContent = `Round ${currentRound.toString()} of ${maximumRounds}`
        localStorage.setItem('current_round', endRound.toString());
    }
    //update drawer
    switchDrawer()
}

function switchDrawer(){
    let currentDrawerId = localStorage.getItem("drawer_id");
    let nextDrawerId = getNextDrawerId(currentDrawerId);
    let myId = localStorage.getItem("user_id");
    localStorage.setItem('can_guess', 'true');
    if (myId === currentDrawerId) {
        canvas.clearCanvas();
        canvas.removeAllEventListeners();
    } else if (myId === nextDrawerId) {
        localStorage.setItem('can_guess', 'false');
        canvas.addAllEventListeners();
    }
    if (currentDrawerId === myId){

        fetch("/update-drawer", {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nextDrawerId)
        })
            .then(response => response.json())
            .then(socket.emit('update-drawer', {drawerId: nextDrawerId, roomId: localStorage.getItem('room_id')}))
    }
}


function getNextDrawerId(currentDrawerId){
    let newDrawerId
    let foundDrawer = false
    let players = document.querySelectorAll(".player")
    for (let i = 0; i < players.length - 1; i++){
        if (players[i].dataset.playerid === currentDrawerId){
            newDrawerId =  players[i+1].dataset.playerid
            foundDrawer = true
        }
    }
    if (!foundDrawer) {
        newDrawerId = localStorage.getItem('owner_id');
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
    if (localStorage.getItem('drawer_id') === localStorage.getItem('user_id')) {
        game.getWord();
    }
    roundChangeGameFlow()
}

function theEnd() {
    let modalTextContainer = document.querySelector("#modal-text-container");
    let modal = document.querySelector(".modal");
    modal.style.display = "block";
    let players = document.querySelectorAll('.player');
    let playerPositions = [];
    players.forEach((player)=> {
        let actualData = []
        let playerPoints = player.querySelector('.points').innerHTML;
        actualData.push(parseInt(playerPoints));
        actualData.push(player.querySelector('.player-name').innerHTML)
        playerPositions.push(actualData);
    })
    let sortedPlayerPositions = playerPositions.sort((a, b) => {
    return b[0] - a[0]});
    let endingStateText = `<p>GAME OVER</p><ul id="endingPositions"></ul>`
    modalTextContainer.innerHTML = '';
    modalTextContainer.insertAdjacentHTML('beforeend', endingStateText);
    let endingListOfPlayers = document.querySelector('#endingPositions');
    for (let playerPosition of sortedPlayerPositions) {
        let playerData = `<li>${playerPosition[0]} point(s) -  ${playerPosition[1]}</li>`
        endingListOfPlayers.insertAdjacentHTML('beforeend', playerData);
    }
    let word = document.querySelector('.word');
    word.innerHTML = '';
    let round = document.querySelector('.round');
    round.innerHTML = '';
}
