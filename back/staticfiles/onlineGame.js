import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import game from './game.js'



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class onlineGame extends game {
	constructor() {
		super();
		this.socket = new WebSocket('ws://127.0.0.1:8000/ws/game/');
		this.start_game = false;
		this.isPlayerOne = false;
		this.isPlayerTwo = false;
		this.connectWebSocket();
	}

	async initGame() {
		console.log("init game");
		while (!this.waitForImagesToLoad()) {
			this.showLoadingScreen("loading assets ...");
			await sleep(200);
		}
		while (!this.start_game) {
			this.showLoadingScreen("Waiting For Other Player ...");
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
		await this.initGame();
		await this.loadGame("starting game", 300);
		this.gameLoop();
	}

	connectWebSocket() {
		this.socket.onopen = (e) => {
			console.log("Connected to server");
			// this.sendMessage("Hello, server!");
		};
		
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			// console.log(data);

			const whichPlayer = data.which_player;
			const message = data.message;

			if (whichPlayer == "Player 1")
				this.isPlayerOne = true;
			if (whichPlayer == "Player 2")
				this.isPlayerTwo = true;
			
			if (message === "Start Game") {
				this.start_game = true;
				// console.log ("which player : ", this.playerOne, this.playerTwo);
				return ;
			}
			this.handleServerMessage(message);
		};
	
		this.socket.onerror = (error) => {
			console.log("WebSocket Error: ", error);
		};

		this.socket.onclose = (event) => {
			if (event.wasClean) {
				console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('Connection died');
			}
		};
	}

	async handleServerMessage(data) {
		const action = data.action;
		const player = data.player;

		// console.log("recieve message :", action, player);
		if (action == "attack") {
			if (player == "playerOne")
				this.playerOne.startAnimation(action);
			else
				this.playerTwo.startAnimation(action);
		}
		if (action == "retreat" ) {
			if (player == "playerOne") {
				this.playerOne.startAnimation("retreat");
			}
			else {
				this.playerTwo.startAnimation("retreat");
			}
		}
		if (action == "game over")
			await this.gameOver();
	}

	sendMessage(message) {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({message: message}));
		} else {
			console.log("WebSocket is not open. Message not sent.");
		}
	}

	handlePlayeAction(action, key) {
		if (this.playerOne.isFrozen || this.playerTwo.isFrozen)
			return ;

		const player = key == "s" || key == "w" || key == "mouseTop" ? "playerOne": "playerTwo";

		const whichPlayer = player == "playerOne" ? this.playerOne : this.playerTwo;

		// console.log("action ", action);
		this.sendMessage({action: action, player: player});
	}

	handleKeyPress(event) {
		const key = event.key;

		if (this.playerOne.win || this.playerTwo.win)
			return ;
		
		console.log("key :: ", key, "player ::", this.isPlayerOne, this.isPlayerTwo);

		if (key == "w" && this.playerOne.state == "retreat" && this.isPlayerOne)
			this.handlePlayeAction("retreat", key)
		else if (key == "ArrowDown" && this.playerTwo.state == "retreat" && this.isPlayerTwo)
			this.handlePlayeAction("retreat", key)
	
		else if (key == "s" && this.playerOne.state == "attack" && this.isPlayerOne)
			this.handlePlayeAction("attack", key)
		else if (key == "ArrowUp" && this.playerTwo.state == "attack" && this.isPlayerTwo)
			this.handlePlayeAction("attack", key)
	}

	handleCanvasClick(event) {
        let rect = this.canvas.getBoundingClientRect();
        let x = event.pageX - rect.left;
        let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton) && this.isPlayerOne) {
			if (this.playerOne.win || this.playerTwo.win) {
				return this.handlePlayeAction("game over", "mouseTop");
			}
			this.handlePlayeAction(this.playerOne.state, "mouseTop");
		}
		if (this.isButtonClicked(x, y, this.bottomButton) && this.isPlayerTwo) {
			if (this.playerOne.win || this.playerTwo.win) {
				return this.handlePlayeAction("game over", "mouseButtom");
			}
			this.handlePlayeAction(this.playerTwo.state, "mouseButtom");
        }
    }
}

export default onlineGame;


