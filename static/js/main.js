import * as socket from './socket.js'
import * as canvas from './canvas.js'
import * as chat from './chat.js'
import * as game from './game.js'
import * as timer from './timer.js'

async function initGame() {
    socket.init();
    canvas.init(localStorage.getItem('owner_id'), localStorage.getItem('user_id'));
    chat.init();
    game.addSocketListenerPoints();
    // await game.getWord();
    await timer.gameInit();
}

initGame();