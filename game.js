import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';

class game {
	constructor() {
		this.gameCanvas = new game_Canvas();
		this.context = this.gameCanvas.getContext();
		this.canvas = this.gameCanvas.getCanvas();
		
		this.playerOneHand = new CustomImage("./assets/hand.png");
		this.playerTwoHand = new CustomImage("./assets/player-two-hand.png");

		this.playerOneAttackButton = new CustomImage("./assets/attack-green.png");
		this.playerTwoAttackButton = new CustomImage("./assets/attack-blue.png");
		
		this.handleCanvasClick = this.handleCanvasClick.bind(this);
    	this.canvas.addEventListener("click", this.handleCanvasClick);

		this.waitForImagesToLoad();
	}
	
	waitForImagesToLoad() {
		let images = [this.playerOneHand, this.playerTwoHand, this.playerOneAttackButton, this.playerTwoAttackButton];
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

		this.gameLoop();
	}

	gameLoop() {
		this.playerOne.update();
		this.playerTwo.update();
		this.drawAll();

		requestAnimationFrame(() => this.gameLoop());
	}

	drawAll() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();
	
		this.context.clearRect(0, 0, canvasWidth, canvasHeight);
	
		// Draw background colors
		let margin = 10;
		let tophalf = canvasHeight / 2 - margin;
		let bottomhalf = canvasHeight / 2 + margin;
	
		this.context.fillStyle = '#BA4A9F';
		this.context.fillRect(0, 0, canvasWidth, tophalf);
	
		this.context.fillStyle = '#317BBF';
		this.context.fillRect(0, canvasHeight / 2, canvasWidth, bottomhalf);
	
		// Draw hand image first
		let playerOneHandX = this.gameCanvas.getCenterX(this.playerOneHand.width);
		let playerTwoHandY = this.playerTwo.getHandCurrentY();
		this.playerOneHand.draw(this.context, playerOneHandX, playerTwoHandY);

		// Draw player two hand image
		let playerTwoHandX = this.gameCanvas.getCenterX(this.playerOneHand.width);
		let playerOneHandY = this.playerOne.getHandCurrentY();
		this.playerTwoHand.draw(this.context, playerTwoHandX, playerOneHandY);

	
		let playerOneBottomX = this.gameCanvas.getCenterX(this.playerOneAttackButton.width);
		let playerOneBottomY = canvasHeight - 110;
		this.playerOneAttackButton.draw(this.context, playerOneBottomX, playerOneBottomY);
		
		let playerTwoBottomX = this.gameCanvas.getCenterX(this.playerOneAttackButton.width);
		let playerTwoBottomY = -20;
		this.playerTwoAttackButton.draw(this.context, playerTwoBottomX, playerTwoBottomY);
	}


	handleCanvasClick(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = event.pageX -  rect.left;
		let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.playerTwoAttackButton)) {
			if (!this.playerOne.isPlayerAnimating) {
				console.log("Clicked on player two attack");
				this.playerOne.startAnimation("retreat");
            }
        }
        if (this.isButtonClicked(x, y, this.playerOneAttackButton)) {
            console.log("Clicked on player one attack");
            if (!this.playerTwo.isPlayerAnimating) {
				this.playerTwo.startAnimation("attack");
            }
        }
    }

	isButtonClicked(x, y, image) {
		let imgX = image.x;
		if (imgX < 0) {
			imgX = 0;
		}
		let imgY = image.y;
		if (imgY < 0) {
			imgY = 0;
		}
		let res = x >= imgX && x <= imgX + image.width && y >= imgY && y <= imgY + image.height;
		return res;
	}

	getCanvas() {
		return this.canvas;
	}
}

export default game;



