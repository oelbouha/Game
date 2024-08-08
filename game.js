import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import GameManager from './GameManager.js';


class game {
	constructor() {
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
		this.handleKeyPress = this.handleKeyPress.bind(this);

    	this.canvas.addEventListener("click", this.handleCanvasClick);
		this.canvas.addEventListener("keydown", this.handleKeyPress);

		this.attackColor = "#FFA500";
		this.retreatColor = "#317AB3";


		this.topButton = this.topAttackButton;
		this.bottomButton = this.bottomRetreatButton;

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
		this.playerOne = new Player("top", "attack", this.gameCanvas.getHeight(), this.playerTwoHand, this.playerOneHand);
		this.playerTwo = new Player("buttom", "retreat", this.gameCanvas.getHeight(), this.playerOneHand, this.playerTwoHand);

		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);

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
			this.playerTwoHand.draw(this.context, playerTwoHandX, playerTwoHandY);
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

		this.drawHands();
	
		this.drawButtons();
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
				this.playerOne.startAnimation("attack");
		}
		if (event.key === "w") {
			if (this.playerOne.getState() == "retreat")
				this.playerOne.startAnimation("retreat");
		}
		// for player two
		if (event.key === "ArrowUp") {
			if (this.playerTwo.getState() == "attack")
				this.playerTwo.startAnimation("attack");
		}
		if (event.key === "ArrowDown") {
			if (this.playerTwo.getState() == "retreat")
				this.playerTwo.startAnimation("retreat");
		}
	}

	handleCanvasClick(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = event.pageX -  rect.left;
		let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton)) {
			if (!this.playerOne.isPlayerAnimating) 
				this.playerOne.startAnimation(this.playerOne.state);
        }
        if (this.isButtonClicked(x, y, this.bottomButton)) {
            if (!this.playerTwo.isPlayerAnimating)
				this.playerTwo.startAnimation(this.playerTwo.state);
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



