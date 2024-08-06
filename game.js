import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import GameManager from './GameManager.js';


class game {
	constructor() {
		this.gameManager = new GameManager();
		this.gameCanvas = new game_Canvas();
		this.context = this.gameCanvas.getContext();
		this.canvas = this.gameCanvas.getCanvas();

		this.canvas.tabIndex = 0;
		this.canvas.focus();

		
		this.playerOneHand = new CustomImage("./assets/hand.png");
		this.playerTwoHand = new CustomImage("./assets/player-two-hand.png");

		this.topAttackButton = new CustomImage("./assets/top-attack.png");
		this.bottomAttackButton = new CustomImage("./assets/attack-green.png");
		
		this.topRetreatButton = new CustomImage("./assets/attack-blue.png");
		this.bottomRetreatButton = new CustomImage("./assets/buttom-retreat.png");


		this.playerOneAttackButton = new CustomImage("./assets/attack-green.png");
		this.playerTwoAttackButton = new CustomImage("./assets/attack-blue.png");
		
		this.handleCanvasClick = this.handleCanvasClick.bind(this);

    	this.canvas.addEventListener("click", this.handleCanvasClick);
		this.canvas.addEventListener("keydown", this.handleKeyPress);

		this.handleKeyPress = this.handleKeyPress.bind(this);


		this.topButton = this.topRetreatButton;
		this.bottomButton = this.bottomAttackButton;

		this.topBackgroundColor = "#FFA500";
		this.bottomBackgroundColor = "#317AB3";

		this.waitForImagesToLoad();
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
	
	startGame() {
		this.playerOne = new Player("top", "retreat", this.gameCanvas.getHeight(), this.playerTwoHand, this.playerOneHand);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas.getHeight(), this.playerOneHand, this.playerTwoHand);

		// console.log(this.playerOne);
		// console.log(this.playerTwo);
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
		
		let buttonX = this.gameCanvas.getCenterX(this.bottomButton.width);
		let buttonY = -20;
		this.topButton.draw(this.context, buttonX, buttonY);
		
		buttonX = this.gameCanvas.getCenterX(this.topButton.width);
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
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerOneHandY);
		}
		else {
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerTwoHandY);
			this.playerOneHand.draw(this.context, playerOneHandX, playerOneHandY);
		}
	}

	clearCanvas() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();
		this.context.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	drawAll() {
		this.clearCanvas();
		this.drawBackground();
		
		this.drawScore();

		this.drawHands();
	
		this.drawButtons();
	}

	switchColors() {
		let temp = this.topBackgroundColor;
		this.topBackgroundColor = this.bottomBackgroundColor;
		this.bottomBackgroundColor = temp;
	}

	handleKeyPress(event) {
		console.log(event);

		if (event.key === "ArrowUp") {
			console.log("Arrow Up pressed");
		}
	}

	handleCanvasClick(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = event.pageX -  rect.left;
		let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton)) {
			if (!this.playerOne.isPlayerAnimating) {
				let state = this.playerOne.state;
				this.playerOne.startAnimation(state);
            }
        }
        if (this.isButtonClicked(x, y, this.bottomButton)) {
            if (!this.playerTwo.isPlayerAnimating) {
				let state = this.playerTwo.state;
				this.playerTwo.startAnimation(state);
            }
			if (this.playerTwo.isMissed) {
				// console.log("Player 2 missed the attack     ...");
				// this.gameManager.update(this.playerTwo);
				// this.bottomButton = this.bottomRetreatButton;
				// this.switchColors();
			}
        }
    }
	drawScore() {
		const	margin = 10;
		const	fontSize = 50;
		const	scoreX = this.gameCanvas.getCanvasWidth() - 100;
		const	canvasCenter = this.gameCanvas.getCanvasHeight() / 2 - margin;

		this.context.font = "50px Arial";
		this.context.fillStyle = "white";
		this.context.fillText(this.playerOne.counter, scoreX, canvasCenter - 50 - margin);
		this.context.fillText(this.playerTwo.counter, scoreX, canvasCenter + 50  + fontSize);
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



