import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import game from './game.js'



class offlineGame extends game {
	constructor() {
		super();
	}

	async initGame() {
		console.log("init game");
		while (!this.waitForImagesToLoad()) {
			this.showLoadingScreen("Loading assets ...");
			await sleep(200);
		}

		this.playerOne = new Player("top", "retreat", this.gameCanvas, this.playerOneHand, this.context, this.assets, this);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas, this.playerTwoHand, this.context, this.assets, this);
		
		this.playerOne.initPlayer();
		this.playerTwo.initPlayer();

		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);
	}

	async startGame() {
		await this.loadGame("starting game");

		await this.initGame();

		this.gameLoop();
	}

	handlePlayeAction(action, key) {
		if (this.playerOne.isFrozen || this.playerTwo.isFrozen)
			return ;

		const playerOneState = this.playerOne.getState();
		const playerTwoState = this.playerTwo.getState();

		this.playerOne.shouldAttack = key === "s" || key === "mouseTop" && playerOneState == "attack" ? true : false;
		this.playerOne.shouldRetreat = key === "w" || key === "mouseTop" && playerOneState == "retreat" ? true : false;

		this.playerTwo.shouldAttack = key === "ArrowUp" || key === "mouseButtom" && playerTwoState == "attack" ? true : false;
		this.playerTwo.shouldRetreat = key === "ArrowDown" || key === "mouseButtom" && playerTwoState == "retreat" ? true : false;

		const attackPLayer = this.playerOne.getState() === "attack" ? this.playerOne : this.playerTwo;
		const retreatPlayer = this.playerTwo.getState() === "retreat" ? this.playerTwo : this.playerOne;

		if (action == "attack")
			return attackPLayer.startAnimation(action);
		else if (action == "game over")
			return this.gameOver();
		else if (action == "retreat")
			retreatPlayer.startAnimation(action);
	}

}

export default offlineGame;

