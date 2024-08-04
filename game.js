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
		
		this.handInitialY = this.gameCanvas.getHeight() - 883 / 2; // Initial Y position of the hand

		// console.log("initial y pos: " + this.handInitialY);
		// console.log("canvas height: " + this.gameCanvas.getHeight());


		this.playerOneAnimating = false;
		this.playerTwoAnimating = false;

		this.playerOneButtonY = this.gameCanvas.getHeight() - 110;
		this.playerTwoButtonY = 0 - 131 / 2;
		this.handCurrentY = this.handInitialY; // Current Y position
		this.maxHandHeight = this.gameCanvas.getHeight() - 883 + 40 ; // Height of the hand image
		this.maxHeigthRetreat = -700;

		this.playerTwoInitialY = - 883 / 2;
		this.playerTwoCurrenty = this.playerTwoInitialY;

		this.isRising = true;
		this.animationFrame = null;
		
		
		this.handTwoInitialY = - 883 / 2;
        this.handTwoCurrentY = this.handTwoInitialY;
        this.maxHandTwoHeight = this.gameCanvas.getHeight() / 2 - 883 / 2;
		
		this.isPlayerOneAnimating = false;
		this.isPlayerTwoAnimating = false;
		
		this.pauseDuration = 2000;
		this.puseTimer = 0;
		this.animationSpeed = 2;
		this.isPlayerOnePaused = false;
		this.isPlayerTwoPaused = false;

        this.isPlayerOneRising = true;
        this.isPlayerTwoFalling = true;

		this.playerTwoRising = true;

		this.animateRetreat = this.animateRetreat.bind(this);
	}

	animateRetreat() {

		if (!this.isPlayerTwoAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}

		if (this.isPlayerTwoPaused) {
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
			return;
		}

		if (this.isPlayerTwoRising) {
			console.log("hand two current y: " + this.handTwoCurrentY);
			this.handTwoCurrentY -= this.animationSpeed;
			console.log("hand two current y: " + this.handTwoCurrentY);
			if (this.handTwoCurrentY <= this.maxHeigthRetreat){
				this.handTwoCurrentY = this.maxHeigthRetreat;
				this.isPlayerTwoRising = false;
				this.isPlayerTwoPaused = true;
				setTimeout(() => {
					this.isPlayerTwoPaused = false;
					this.animateRetreat();
				}, this.pauseDuration);
				return;
			}
		}
		else {
			console.log("hreturning to  y: " + this.handTwoCurrentY);
			this.handTwoCurrentY += this.animationSpeed;
			if (this.handTwoCurrentY >= this.handTwoInitialY) {
				this.handTwoCurrentY = this.handTwoInitialY;
				this.isPlayerTwoAnimating = false;
				this.isPlayerTwoRising = true;
			}
		}

		this.drawAll();

		if (this.isPlayerTwoAnimating) {
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
		}
	}

	drawAll() {
		let canvasWidth = this.gameCanvas.getWidth();
		let canvasHeight = this.gameCanvas.getHeight();
	
		this.context.clearRect(0, 0, canvasWidth, canvasHeight);
	
		let margin = 10;
		let tophalf = canvasHeight / 2 - margin;
		let bottomhalf = canvasHeight / 2 + margin;
	
		this.context.fillStyle = '#BA4A9F';
		this.context.fillRect(0, 0, canvasWidth, tophalf);
	
		this.context.fillStyle = '#317BBF';
		this.context.fillRect(0, canvasHeight / 2, canvasWidth, bottomhalf);
	
		// Draw hand image first
		let handImageWidth = 220;
		let handImageHeight = 883;
		let playerOneHandX = this.gameCanvas.getCenterX(handImageWidth);
		let playerOneHandY = this.handCurrentY;
		this.playerOneHand.setImageDimensions(playerOneHandX, playerOneHandY, handImageWidth, handImageHeight);
		this.playerOneHand.draw(this.context);

		// Draw player two hand image
		let playerTwoHandX = this.gameCanvas.getCenterX(handImageWidth);
		let playerTwoHandY = this.handTwoCurrentY;
		this.playerTwoHand.setImageDimensions(playerTwoHandX, playerTwoHandY, handImageWidth, handImageHeight);
		this.playerTwoHand.draw(this.context);
		

		// draw attack bottom images
		let atackImageWidth = 543;
		let atackImageHeight = 131;
	
		let playerOneBottomX = this.gameCanvas.getCenterX(atackImageWidth);
		let playerOneBottomY = canvasHeight - 110;
		this.playerOneAttackButton.setImageDimensions(playerOneBottomX, playerOneBottomY, atackImageWidth, atackImageHeight);
		this.playerOneAttackButton.draw(this.context);
		
		let playerTwoBottomX = this.gameCanvas.getCenterX(atackImageWidth);
		let playerTwoBottomY = -20;

		console.log("player two bottom x: " + playerTwoBottomX);
		console.log("player two bottom y: " + playerTwoBottomY);

		this.playerTwoAttackButton.setImageDimensions(playerTwoBottomX, playerTwoBottomY, atackImageWidth, atackImageHeight);
		this.playerTwoAttackButton.draw(this.context);

		this.animateAttack = this.animateAttack.bind(this);
		this.animateAttackTop = this.animateAttackTop.bind(this);
		
		
		if (this.isPlayerOneAnimating) {
			requestAnimationFrame(() => this.animateAttack());
		}
		if (this.isPlayerTwoAnimating) {
			requestAnimationFrame(() => this.animateRetreat());
		}

		if (this.isPlayerTwoAnimating) {
			requestAnimationFrame(() => this.animateRetreat());
		}
	}

	animateAttack() {
        if (!this.isPlayerOneAnimating) {
            cancelAnimationFrame(this.animationFrame);
            return;
        }
    
        if (this.isPlayerOnePaused) {
            this.animationFrame = requestAnimationFrame(this.animateAttack);
            return;
        }
    
        if (this.isPlayerOneRising) {
            // Rising
            this.handCurrentY -= this.animationSpeed;
            if (this.handCurrentY <= this.maxHandHeight) {
                this.handCurrentY = this.maxHandHeight;
                this.isPlayerOneRising = false;
                this.isPlayerOnePaused = true;
                setTimeout(() => {
                    this.isPlayerOnePaused = false;
                    this.animateAttack();
                }, this.pauseDuration);
                return;
            }
        } else {
            // Falling
            this.handCurrentY += this.animationSpeed;
            if (this.handCurrentY >= this.handInitialY) {
                this.handCurrentY = this.handInitialY;
                this.isPlayerOneAnimating = false;
                this.isPlayerOneRising = true;
            }
        }
    
        this.drawAll();
        
        if (this.isPlayerOneAnimating) {
            this.animationFrame = requestAnimationFrame(this.animateAttack);
        }
    }

    animateAttackTop() {
        if (!this.isPlayerTwoAnimating) {
            cancelAnimationFrame(this.animationFrame);
            return;
        }
    
        if (this.isPlayerTwoPaused) {
            this.animationFrame = requestAnimationFrame(this.animateAttackTop);
            return;
        }

        if (this.isPlayerTwoFalling) {
            // Falling (for player two, falling means moving down the screen)
            this.handTwoCurrentY += this.animationSpeed;
            if (this.handTwoCurrentY >= this.maxHandTwoHeight) {
                this.handTwoCurrentY = this.maxHandTwoHeight;
                this.isPlayerTwoFalling = false;
                this.isPlayerTwoPaused = true;
                setTimeout(() => {
                    this.isPlayerTwoPaused = false;
                    this.animateAttackTop();
                }, this.pauseDuration);
                return;
            }
        } else {
            // Rising (for player two, rising means moving up the screen)
            this.handTwoCurrentY -= this.animationSpeed;
            if (this.handTwoCurrentY <= this.handTwoInitialY) {
                this.handTwoCurrentY = this.handTwoInitialY;
                this.isPlayerTwoAnimating = false;
                this.isPlayerTwoFalling = true;
            }
        }
    
        this.drawAll();
        
        if (this.isPlayerTwoAnimating) {
            this.animationFrame = requestAnimationFrame(this.animateAttackTop);
        }
    }
	
	handleCanvasClick(event) {
		let rect = this.canvas.getBoundingClientRect();
		let x = event.pageX -  rect.left;
		let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.playerTwoAttackButton)) {
			if (!this.isPlayerTwoAnimating) {
				console.log("Clicked on player two attack");
                this.isPlayerTwoAnimating = true;
                this.isPlayerTwoRising = true;
                this.handTwoCurrentY = this.handTwoInitialY;
                this.animationFrame = requestAnimationFrame(this.animateRetreat);
            }
        }
        if (this.isButtonClicked(x, y, this.playerOneAttackButton)) {
            console.log("Clicked on player one attack");
            if (!this.isPlayerOneAnimating) {
                this.isPlayerOneAnimating = true;
                this.isPlayerOneRising = true;
                this.handCurrentY = this.handInitialY;
                this.animationFrame = requestAnimationFrame(this.animateAttack);
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
	resizeCanvas() {
		this.gameCanvas.setWidth(window.innerWidth);
		this.gameCanvas.setHeight(window.innerHeight);
		this.drawAll();
	}

	draawline(context, x, y, canvasWidth, canvasHeight) {
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x, canvasHeight);
		context.strokeStyle = "black";
		context.lineWidth = 2;
		context.stroke();
	}

}

export default game;