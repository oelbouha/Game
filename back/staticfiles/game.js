import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import GameManager from './GameManager.js';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadGame(gameInstance) {
    let message = "Loading game ... 0%";
    gameInstance.showLoadingScreen(message);
    for (let i = 0; i < 5; i++) {
        message = `Loading game ... ${i * 20}%`;
        gameInstance.showLoadingScreen(message);
        await sleep(1000);
    }
    gameInstance.showLoadingScreen("Loading game ... 100%");
    await sleep(500);
    gameInstance.startGame();
}


class game {
	constructor() {
		this.socket = new WebSocket('ws://127.0.0.1:8000/ws/game/');
		this.gameCanvas = new game_Canvas();
		this.context = this.gameCanvas.getContext();
		this.canvas = this.gameCanvas.getCanvas();

		this.canvas.tabIndex = 0;
		this.canvas.focus();

		this.winImage = new CustomImage(STATIC_URL + "/assets/winner.png");
		this.loseImage = new CustomImage(STATIC_URL + "/assets/loser.png");

		this.effectImage = new CustomImage(STATIC_URL + "/assets/slap-effect.png");
		this.playerOneHand = new CustomImage(STATIC_URL + "/assets/hand.png");
		this.playerTwoHand = new CustomImage(STATIC_URL + "/assets/player-two-hand.png");

		this.topAttackButton = new CustomImage(STATIC_URL + "/assets/topattack.png");
		this.bottomAttackButton = new CustomImage(STATIC_URL + "/assets/attack-green.png");
		
		this.topRetreatButton = new CustomImage(STATIC_URL + "/assets/attack-blue.png");
		this.bottomRetreatButton = new CustomImage(STATIC_URL + "/assets/buttom-retreat.png");

		this.topRematchButton = new CustomImage(STATIC_URL + "/assets/top-attack.png");
		this.bottomRematchButton = new CustomImage(STATIC_URL + "/assets/buttom-rematch.png");

		this.playerOneAttackButton = new CustomImage(STATIC_URL + "/assets/attack-green.png");
		this.playerTwoAttackButton = new CustomImage(STATIC_URL + "/assets/attack-blue.png");
		
		this.handleCanvasClick = this.handleCanvasClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

    	this.canvas.addEventListener("click", this.handleCanvasClick);
		this.canvas.addEventListener("keydown", this.handleKeyPress);

		this.attackColor = "#FFA500";
		this.retreatColor = "#317AB3";


		this.topButton = this.topRetreatButton;
		this.bottomButton = this.bottomAttackButton;

		this.topBackgroundColor = "#FFA500";
		this.bottomBackgroundColor = "#317AB3";

		this.playerOne = new Player("top", "retreat", this.gameCanvas.getHeight(), this.playerTwoHand, this.playerOneHand, this.context);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas.getHeight(), this.playerOneHand, this.playerTwoHand, this.context);

		this.connectWebSocket();
	}

	connectWebSocket() {
		this.socket.onopen = (e) => {
			console.log("Connected to server");
			this.sendMessage("Hello, server!");
		};
	
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			// console.log(data);
			const message = data.message;

			if (message === "Start Game") {
				loadGame(this);
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

	showLoadingScreen(message) {
		this.context.fillStyle = this.retreatColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = 'white';
		this.context.font = '35px Arial';
		this.context.textAlign = 'center';
		this.context.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
	}

	handleServerMessage(data) {
		console.log ("Handling server message");

		const action = data.action;
		const player = data.player;


		if (action == "attack") {
			if (player == "playerOne")
				this.playerOne.startAnimation("attack");
			else
				this.playerTwo.startAnimation("attack");
		}
		if (action == "retreat" ) {
			if (player == "playerOne")
				this.playerOne.startAnimation("retreat");
			else
				this.playerTwo.startAnimation("retreat");
		}
		if (action == "reset")
			this.reset();
	}

	sendMessage(message) {
		if (this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({message: message}));
		} else {
			console.log("WebSocket is not open. Message not sent.");
		}
	}

	waitForImagesToLoad() {
		let images = [this.playerTwoHand, this.topButton, this.bottomButton, this.playerOneHand];
		let loadedImages = 0;
		images.forEach((image) => {
			if (image.loaded) {
				loadedImages++;
			}
			else {
				image.img.onload = () => {
					loadedImages++;
					if (loadedImages === images.length) {
						this.startGame();
					}
				};
			}
		});
	}
	
	animateHands() {
		// this.playerOne.animate();
		// this.playerTwo.animate();
	}

	reset() {
		this.clearCanvas();
		console.log("resetting the game");
		if (this.playerTwo.win) {
			this.playerOne.state = "attack";
			this.playerTwo.state = "retreat";
			this.topBackgroundColor = this.attackColor;
			this.bottomBackgroundColor = this.retreatColor;
			this.topButton = this.topAttackButton;
			this.bottomButton = this.bottomRetreatButton;
		}
		else {
			this.playerOne.state = "retreat";
			this.playerTwo.state = "attack";
			this.topBackgroundColor = this.retreatColor;
			this.bottomBackgroundColor = this.attackColor;
			this.topButton = this.topRetreatButton;
			this.bottomButton = this.bottomAttackButton;
		}
		this.playerOne.score = 0;
		this.playerTwo.score = 0;
		this.playerOne.win = false;
		this.playerTwo.win = false;
		this.playerOne.isPlayerAnimating = false;
		this.playerTwo.isPlayerAnimating = false;
		this.playerOne.isPlayerFalling = true;
		this.playerOne.isPlayerRising = true;
		this.playerTwo.isPlayerFalling = true;
		this.playerTwo.isPlayerRising = true;
	}
	startGame() {
		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);

		this.gameLoop();
	}

	gameLoop() {
		this.playerOne.update();
		this.playerTwo.update();

		this.drawAll();

		requestAnimationFrame(() => this.gameLoop());
	}

	drawBackground() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();

		let margin = 10;
		let tophalf = canvasHeight / 2 - margin;
		let bottomhalf = canvasHeight / 2 + margin;
	

		this.context.fillStyle = this.topBackgroundColor;
		this.context.fillRect(0, 0, canvasWidth, tophalf);
	
		this.context.fillStyle = this.bottomBackgroundColor;
		this.context.fillRect(0, canvasHeight / 2, canvasWidth, bottomhalf);
	}

	drawButtons() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();
		
		let buttonX = this.gameCanvas.getCenterX(this.topButton.width);
		let buttonY = -20;
		this.topButton.draw(this.context, buttonX, buttonY);
		
		buttonX = this.gameCanvas.getCenterX(this.bottomButton.width);
		buttonY = canvasHeight - 110;
		this.bottomButton.draw(this.context, buttonX, buttonY);
	}

	drawHands() {
		let playerTwoHandX = this.gameCanvas.getCenterX(this.playerOneHand.width);
		let playerTwoHandY = this.playerOne.getHandCurrentY();
		
		let playerOneHandX = this.gameCanvas.getCenterX(this.playerOneHand.width);
		let playerOneHandY = this.playerTwo.getHandCurrentY();
		
		if (this.playerOne.state === "attack") {
			this.playerOneHand.draw(this.context, playerOneHandX, playerOneHandY);
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerTwoHandY);
		}
		else {
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerTwoHandY);
			this.playerOneHand.draw(this.context, playerOneHandX, playerOneHandY);
		}
		// this.effectImage.draw(this.context, this.gameCanvas.getCenterX(this.effectImage.width), this.gameCanvas.getCenterY(this.effectImage.height));
	}

	clearCanvas() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();
		this.context.clearRect(0, 0, canvasWidth, canvasHeight);
	}
	drawWinner() {
		let winnerY = this.gameCanvas.getHeight() - this.playerOne.handHeight / 2;
		let loserY = this.playerOne.handHeight / 2 - this.winImage.height;
		if (this.playerOne.win) {
			winnerY = this.playerOne.handHeight / 2 - this.winImage.height;
			loserY = this.gameCanvas.getHeight() - this.playerOne.handHeight / 2;
		}
		this.winImage.draw(this.context, this.gameCanvas.getCenterX(this.winImage.width), winnerY);
		this.loseImage.draw(this.context, this.gameCanvas.getCenterX(this.loseImage.width), loserY);
		
		this.topButton = this.topRematchButton;
		this.bottomButton = this.bottomRematchButton;
	}

	drawAll() {
		this.clearCanvas();

		if (this.playerOne.state === "attack" && this.playerOne.position === "top") {
			this.topBackgroundColor = this.attackColor;
			this.bottomBackgroundColor = this.retreatColor;
			this.topButton = this.topAttackButton;
			this.bottomButton = this.bottomRetreatButton;
		}
		else {
			this.topBackgroundColor = this.retreatColor;
			this.bottomBackgroundColor = this.attackColor;
			this.topButton = this.topRetreatButton;
			this.bottomButton = this.bottomAttackButton;
		}

		this.drawBackground();

		this.drawScore();

		if (this.playerOne.win || this.playerTwo.win)
			this.drawWinner();
		else
			this.drawHands();
	
		this.drawButtons();

		// if (this.playerOne.score >= 3)
		// 	this.playerOne.harmImage.draw(this.context, this.gameCanvas.getCenterX(this.playerOne.harmImage.width), this.playerTwo.handCurrentY);
		// if (this.playerTwo.score >= 3)
		// 	this.playerTwo.harmImage.draw(this.context, this.gameCanvas.getCenterX(this.playerTwo.harmImage.width), this.playerOne.handCurrentY);
	}

	switchColors() {
		let temp = this.topBackgroundColor;
		this.topBackgroundColor = this.bottomBackgroundColor;
		this.bottomBackgroundColor = temp;
	}

	handleKeyPress(event) {
		// for player one
		if (event.key === "s") {
			if (this.playerOne.getState() == "attack")
				this.sendMessage({action: this.playerOne.state, player: "playerOne"});
		}
		if (event.key === "w") {
			if (this.playerOne.getState() == "retreat")
				this.sendMessage({action: this.playerOne.state, player: "playerOne"});
		}
		// for player two
		if (event.key === "ArrowUp") {
			if (this.playerTwo.getState() == "attack")
				this.sendMessage({action: this.playerTwo.state, player: "playerTwo"});
		}
		if (event.key === "ArrowDown") {
			if (this.playerTwo.getState() == "retreat")
				this.sendMessage({action: this.playerTwo.state, player: "playerTwo"});
		}
	}

	handleCanvasClick(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = event.pageX -  rect.left;
		let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton)) {
			if (this.playerOne.win || this.playerTwo.win) {
				this.sendMessage({action: "reset"});
				return ;
			}
			if (!this.playerOne.isPlayerAnimating) 
				this.sendMessage({action: this.playerOne.state, player: "playerOne"});
			
		}
		if (this.isButtonClicked(x, y, this.bottomButton)) {
			if (this.playerOne.win || this.playerTwo.win) {
				this.sendMessage({action: "reset"});
				return ;
			}
            if (!this.playerTwo.isPlayerAnimating)
				this.sendMessage({action: this.playerTwo.state, player: "playerTwo"});
        }
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

export default game;



