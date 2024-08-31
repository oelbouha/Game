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
		
		this.connectWebSocket();
	}

	async initGame() {
		console.log("init game");
		while (!this.waitForImagesToLoad()) {
			this.showLoadingScreen("loading assets ...");
			await sleep(200);
		}
		while (!this.start_game) {
			this.showLoadingScreen("Waiting for other player ...");
			await sleep(200);
		}

		this.playerOne = new Player("top", "retreat", this.gameCanvas, this.playerOneHand, this.context, this.assets);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas, this.playerTwoHand, this.context, this.assets);
		
		this.playerOne.initPlayer();
		this.playerTwo.initPlayer();

		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);
	}

	async startGame() {
		await this.initGame();
		await this.loadGame("starting game");
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
			const message = data.message;

			if (message === "Start Game") {
				this.start_game = true;
				return ;
			}
			// console.log("Received message from server: ", message);
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

		console.log("recieve message :", action, player);
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
		const currentTime = Date.now();
		
		if (this.playerOne.isFrozen || this.playerTwo.isFrozen)
			return ;
	
		const player = key == "s" || key == "w" || key == "mouseTop" ? "playerOne": "playerTwo";

		const whichPlayer = player == "playerOne" ? this.playerOne : this.playerTwo;

		// console.log("action ", action);
		this.sendMessage({action: action, player: player});
	}

	drawScore() {
		const	margin = 10;
		const	fontSize = 50;
		const	scoreX = this.gameCanvas.getCanvasWidth() - 100;
		const	canvasCenter = this.gameCanvas.getCanvasHeight() / 2 - margin;

		this.context.font = "50px Arial";
		this.context.fillStyle = "white";
		this.context.fillText(this.playerOne.score, scoreX, canvasCenter - 50 - margin);
		this.context.fillText(this.playerTwo.score, scoreX, canvasCenter + 50  + fontSize);
	}

	isButtonClicked(x, y, image) {
		let imgX = image.x < 0 ? 0 : image.x;
		let imgY = image.y < 0 ? 0 : image.y;
		let res = x >= imgX && x <= imgX + image.width && y >= imgY && y <= imgY + image.height;
		return res;
	}

	getCanvas() {
		return this.canvas;
	}
}

export default onlineGame;


