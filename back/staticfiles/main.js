import game from "./game.js";	

let gameInstance = new game();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initGame() {
    console.log("Starting game load");

    while (!gameInstance.waitForImagesToLoad()) {
        gameInstance.showLoadingScreen("Loading assets ...");
        await sleep(200);
    }
    gameInstance.initGame();
    // gameInstance.startGame();
}


initGame();