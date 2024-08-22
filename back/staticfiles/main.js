import game from "./game.js";	

let gameInstance = new game();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadGame() {
    console.log("Starting game load");
    
    gameInstance.showLoadingScreen();
    
    for (let i = 0; i < 5; i++) {
        console.log(`Loading assets... ${i * 20}%`);
        await sleep(1000);
    }
    
    console.log("Assets loaded");
    await sleep(500);
    
    gameInstance.startGame();
}

loadGame();