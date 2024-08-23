import game from "./game.js";	

let gameInstance = new game();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadGame() {
    console.log("Starting game load");
    
    let message = "Loading assets ... 0%";
    gameInstance.showLoadingScreen(message);
    for (let i = 0; i < 5; i++) {
        message = `Loading assets ... ${i * 20}%`;
        gameInstance.showLoadingScreen(message);
        await sleep(1000);
    }
    gameInstance.showLoadingScreen("Loading assets ... 100%");
    await sleep(500);
    gameInstance.startGame();
    
}

loadGame();