import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import GameManager from './GameManager.js';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class game {
	constructor(playerOneHand = null, playerTwoHand = null, winScore) {
		if (!playerOneHand || !playerTwoHand) {
			console.warn("there is no hand")
		}
		this.gameCanvas = new game_Canvas();
		this.context = this.gameCanvas.getContext();
		this.canvas = this.gameCanvas.getCanvas();
		this.canvas.tabIndex = 0;
		this.canvas.focus();

		this.winScore = winScore
		this.isLoading = false;

		this.winImage = new CustomImage(STATIC_URL + "/assets/winner.png");
		this.loseImage = new CustomImage(STATIC_URL + "/assets/loser.png");

		this.effectImage = new CustomImage(STATIC_URL + "/assets/slap-effect.png");
		if (playerOneHand)
			this.playerOneHand = new CustomImage(playerOneHand);
		if (playerTwoHand)
			this.playerTwoHand = new CustomImage(playerTwoHand);

		this.topAttackButton = new CustomImage(STATIC_URL + "/assets/topattack.png");
		this.bottomAttackButton = new CustomImage(STATIC_URL + "/assets/attack-green.png");
		
		this.topRetreatButton = new CustomImage(STATIC_URL + "/assets/attack-blue.png");
		this.bottomRetreatButton = new CustomImage(STATIC_URL + "/assets/buttom-retreat.png");

		this.topRematchButton = new CustomImage(STATIC_URL + "/assets/top-attack.png");
		this.bottomRematchButton = new CustomImage(STATIC_URL + "/assets/buttom-rematch.png");

		this.playerOneAttackButton = new CustomImage(STATIC_URL + "/assets/attack-green.png");
		this.playerTwoAttackButton = new CustomImage(STATIC_URL + "/assets/attack-blue.png");
		
		this.assets = [this.winImage, this.loseImage, this.effectImage, this.topAttackButton, this.bottomAttackButton, this.topRetreatButton, this.bottomRetreatButton, this.playerOneAttackButton, this.playerTwoAttackButton];
		
		this.handleCanvasClick = this.handleCanvasClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

    	this.canvas.addEventListener("click", this.handleCanvasClick);
		this.canvas.addEventListener("keydown", this.handleKeyPress);

		this.attackColor = "#ba499f";
		this.retreatColor = "#317abf";

		this.topButton = this.topRetreatButton;
		this.bottomButton = this.bottomAttackButton;

		this.topBackgroundColor = "#ba499f";
		this.bottomBackgroundColor = "#E69A8DFF";

		this.cooldownPeriod = 800;
        this.playerOneLastActionTime = 0;
        this.playerTwoLastActionTime = 0;

		this.waitForImagesToLoad();
	}

	setPlayerOneHand(hand) {
		this.playerOneHand = hand;
	}
	
	setPlayerTwoHand(hand) {
		this.playerTwoHand = hand;
	}

	async  loadGame(message, timeToSleep) {
		this.isLoading = true;
		this.showLoadingScreen(message + " ... 0%");
		for (let i = 0; i < 5; i++) {
			this.showLoadingScreen(message + ` ... ${i * 20}%`);
			await sleep(timeToSleep);
		}
		this.showLoadingScreen(message + " ... 100%");
		this.isLoading = false;
	}

	showLoadingScreen(message) {
		this.context.fillStyle = this.retreatColor;
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = 'white';
		this.context.font = '35px Arial';
		this.context.textAlign = 'center';
		this.context.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
	}

	waitForImagesToLoad() {
		let loadedImages = 0;

		console.log(this.assets.length);
		this.assets.forEach((image) => {
			if (image.loaded) {
				loadedImages++;
			}
		});
		if (loadedImages === this.assets.length) {
			console.log("All images loaded");
			return true;
		}
		return false;
	}

	async resetPlayers() {
		this.clearCanvas();
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
		this.playerOne.handCurrentY = this.playerOne.hand.getInitialY();
		this.playerTwo.handCurrentY = this.playerTwo.hand.getInitialY();
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
		this.isLoading = false;
		this.playerOne.isFrozen = false;
		this.playerTwo.isFrozen = false;
	}

	async gameOver() {
		await this.resetPlayers();
		await this.loadGame("Restarting Game", 400);
		this.gameLoop();
	}

	gameLoop() {
		if (!this.playerOne.isFrozen && !this.playerTwo.isFrozen) {
			this.playerOne.update();
			this.playerTwo.update();
		}

		if (this.isLoading == false) {
			this.drawAll();
			requestAnimationFrame(() => this.gameLoop());
		}
	}

	drawBackground() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();

		let shakeOffsetX = this.playerOne.shakeOffsetX || 0;
		let shakeOffsetY = this.playerOne.shakeOffsetY || 0;
		if (this.playerTwo.state === "attack") {
			shakeOffsetX = this.playerTwo.shakeOffsetX || 0;
			shakeOffsetY = this.playerTwo.shakeOffsetY || 0;
		}
		let margin = 10;
		let tophalf = canvasHeight / 2 - margin;
		let bottomhalf = canvasHeight / 2 + margin;

		this.context.fillStyle = this.topBackgroundColor;
		this.context.fillRect(shakeOffsetX, shakeOffsetY, canvasWidth, tophalf);
	
		this.context.fillStyle = this.bottomBackgroundColor;
		this.context.fillRect(shakeOffsetX, canvasHeight / 2 + shakeOffsetY, canvasWidth, bottomhalf);
	}

	drawButtons() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();

		let shakeOffsetX = this.playerOne.shakeOffsetX || 0;
		if (this.playerTwo.state === "attack")
			shakeOffsetX = this.playerTwo.shakeOffsetX || 0;

		let buttonX = this.gameCanvas.getCenterX(this.topButton.width) + shakeOffsetX;
		
		let buttonY = -20 + (this.playerOne.shakeOffsetY || 0);
		
		this.topButton.draw(this.context, buttonX, buttonY);
		
		buttonX = this.gameCanvas.getCenterX(this.bottomButton.width) + shakeOffsetX;
		buttonY = canvasHeight - 110 + (this.playerTwo.shakeOffsetY || 0);
		this.bottomButton.draw(this.context, buttonX, buttonY);
	}

	drawHands() {
		let playerTwoHandX = this.gameCanvas.getCenterX(this.playerOneHand.width);
		let playerTwoHandY = this.playerOne.getHandCurrentY();
		
		let playerOneHandX = this.gameCanvas.getCenterX(this.playerOneHand.width);
		let playerOneHandY = this.playerTwo.getHandCurrentY()
		
		if (this.playerOne.state === "attack") {
			this.playerOneHand.draw(this.context, playerOneHandX, playerOneHandY);
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerTwoHandY, true);
		}
		else {
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerTwoHandY, true);
			this.playerOneHand.draw(this.context, playerOneHandX, playerOneHandY);
		}
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

		if (this.playerOne.win || this.playerTwo.win) {
			this.drawWinner();
		}
		else
			this.drawHands();
	
		this.drawButtons();
	}

	async switchColors() {
		
		let temp = this.topBackgroundColor;
		this.topBackgroundColor = this.bottomBackgroundColor;
		this.bottomBackgroundColor = temp;
	}

	handleKeyPress(event) {
		const key = event.key;

		if (this.playerOne.win || this.playerTwo.win)
			return ;
		if (key == "w" && this.playerOne.state == "retreat")
			this.handlePlayeAction("retreat", key)
		else if (key == "ArrowDown" && this.playerTwo.state == "retreat")
			this.handlePlayeAction("retreat", key)
		else if (key == "s" && this.playerOne.state == "attack")
			this.handlePlayeAction("attack", key)
		else if (key == "ArrowUp" && this.playerTwo.state == "attack")
			this.handlePlayeAction("attack", key)
	}

	handleCanvasClick(event) {
        let rect = this.canvas.getBoundingClientRect();
        let x = event.pageX - rect.left;
        let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton)) {
			if (this.playerOne.win || this.playerTwo.win) {
				return this.handlePlayeAction("game over", "mouseTop");
			}
			this.handlePlayeAction(this.playerOne.state, "mouseTop");
		}
		if (this.isButtonClicked(x, y, this.bottomButton)) {
			if (this.playerOne.win || this.playerTwo.win) {
				return this.handlePlayeAction("game over", "mouseButtom");
			}
			this.handlePlayeAction(this.playerTwo.state, "mouseButtom");
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


	// if (event.key === "s") {
	// 	if (this.playerOne.getState() == "attack") {
	// 		if (currentTime - this.playerOneLastActionTime >= this.cooldownPeriod) {
	// 			this.sendMessage({action: this.playerOne.state, player: "playerOne"});
	// 			this.playerOneLastActionTime = currentTime;
	// 		}
	// 	}
			
	// }
	// if (event.key === "w") {
	// 	if (this.playerOne.getState() == "retreat") {
	// 		if (currentTime - this.playerOneLastActionTime >= this.cooldownPeriod) {
	// 			this.sendMessage({action: this.playerOne.state, player: "playerOne"});
	// 			this.playerOneLastActionTime = currentTime;
	// 		}
	// 	}
	// }
	// // for player two
	// if (event.key === "ArrowUp") {
	// 	if (this.playerTwo.getState() == "attack") {
	// 		if (currentTime - this.playerTwoLastActionTime >= this.cooldownPeriod) {
	// 			this.sendMessage({action: this.playerTwo.state, player: "playerTwo"});
	// 			this.playerTwoLastActionTime = currentTime;
	// 	}
	// }	
	// }

	// if (event.key === "ArrowDown") {
	// 	if (this.playerTwo.getState() == "retreat") {
	// 		if (currentTime - this.playerTwoLastActionTime >= this.cooldownPeriod) {
	// 			this.sendMessage({action: this.playerTwo.state, player: "playerTwo"});
	// 			this.playerTwoLastActionTime = currentTime;
	// 		}
	// 	}
	// }