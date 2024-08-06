import Hand from "./Hand.js";


class Player {
	constructor(position, state, canvasHeight, PlayerHandImage, handSize) {
		this.state = state;
		this.hand = new Hand(position, canvasHeight, PlayerHandImage);
		this.position = position;
		this.isPlayerPaused = false;
		
		this.handWidth = handSize.width;
		this.handHeight = handSize.height;

		this.isPlayerAnimating = false;
		this.isPlayerRising = true;
		this.isPlayerFalling = true;

		
		this.pauseDuration = 1000;
		this.animationSpeed = 50;
		this.animationFrame = null;
		
		this.maxAttackHeight = canvasHeight - 883 + 40;
		this.maxRetreatHeight = -700;
		
		// this.animateRetreat = this.animateRetreat.bind(this);
		// this.animateAttack = this.animateAttack.bind(this);
		
		this.hnadInitialY = this.hand.getInitialY();
		this.handCurrentY = this.hnadInitialY;
		
		// console.log("Player position: ", this.position);
		// console.log("Player state: ", this.state);

	}

	startAnimation(type) {
		console.log("startAnimation ... function called ...");
		this.isPlayerAnimating = true;
		if (type === "attack") {

			console.log("startAnimation attack ...");
			
			this.animateAttack();
		}
		else if (type === "retreat") {
			this.animateRetreat();
		}
	}

	update() {
		if (this.isPlayerAnimating) {
			if (this.animationType === "attack") {
				this.animateAttack();
			} else if (this.animationType === "retreat") {
				this.animateRetreat();
			}
		}
	}

	stopAnimation() {
		this.isPlayerAnimating = false;
		cancelAnimationFrame(this.animationFrame);
	}
	
	animateAttack() {
		if (!this.isPlayerAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}

		if (this.isPlayerPaused) {
			this.animationFrame = requestAnimationFrame(() => this.animateAttack());
			return;
		}

		if (this.position == "top") {
			console.log("animateTopAttack ...");
			this.animateTopAttack();
		}
		else {
			console.log("animateButtomAttack ... function called ...");
			this.animateButtomAttack();
		}

		this.update();

		if (this.isPlayerAnimating) {
			this.animationFrame = requestAnimationFrame(() => this.animateAttack());
		}
		
	}

	animateTopAttack() {
		if (this.isPlayerFalling) {
            // Falling (for player two, falling means moving down the screen)
            this.handCurrentY += this.animationSpeed;
            if (this.handCurrentY >= this.maxAttackHeight) {
                this.handCurrentY = this.maxAttackHeight;
                this.isPlayerFalling = false;
                this.isPlayerPaused = true;
                setTimeout(() => {
                    this.isPlayerPaused = false;
                    this.animateTopAttack();
                }, this.pauseDuration);
                return;
            }
        } else {
            // Rising (for player two, rising means moving up the screen)
            this.handCurrentY -= this.animationSpeed;
            if (this.handCurrentY <= this.hand.getInitialY()) {
                this.handCurrentY = this.hand.getInitialY();
                this.isPlayerAnimating = false;
                this.isPlayerFalling = true;
            }
        }
	}

	animateButtomAttack() {
		if (this.isPlayerRising) {
            this.handCurrentY -= this.animationSpeed;
            if (this.handCurrentY <= this.maxAttackHeight) {
				this.handCurrentY = this.maxAttackHeight;
                this.isPlayerRising = false;
                this.isPlayerPaused = true;
                setTimeout(() => {
                    this.isPlayerPaused = false;
                    this.animateButtomAttack();
                }, this.pauseDuration);
                return;
            }
        } else {
			console.log("player is falling ...");
            // Falling
            this.handCurrentY += this.animationSpeed;
            if (this.handCurrentY >= this.hand.getInitialY()) {
                this.handCurrentY = this.hand.getInitialY();
                this.isPlayerAnimating = false;
                this.isPlayerRising = true;
            }
        }
	}

	animateRetreat() {
		// console.log("animate      |   Retreat ...");
		if (!this.isPlayerAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}

		if (this.isPlayerPaused) {
			// console.log("animateRetreat requet ...");
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
			return;
		}

		if (this.position == "top") {
			this.animateTopRetreat();
		}
		else {
			this.animateButtomRetreat();
		}
		
		this.update();
		
		if (this.isPlayerAnimating) {
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
		}
	}
	animateTopRetreat() {
		if (this.isPlayerRising) {
			this.handCurrentY -= this.animationSpeed;
			if (this.handCurrentY <= this.maxRetreatHeight){
				this.handCurrentY = this.maxRetreatHeight;
				this.isPlayerRising = false;
				this.isPlayerPaused = true;
				setTimeout(() => {
					this.isPlayerPaused = false;
					this.animateTopRetreat();
				}, this.pauseDuration);
				return;
			}
		}
		else {
			this.handCurrentY += this.animationSpeed;
			if (this.handCurrentY >= this.hand.getInitialY()) {
				this.handCurrentY = this.hand.getInitialY();
				this.isPlayerAnimating = false;
				this.isPlayerRising = true;

			}
		}
	}
	
	animateButtomRetreat() {
		if (this.isPlayerFalling) {
			this.handCurrentY += this.animationSpeed;
			if (this.handCurrentY >= this.maxRetreatHeight) {
				this.handCurrentY = this.maxRetreatHeight;
				this.isPlayerFalling = false;
				this.isPlayerPaused = true;
				setTimeout(() => {
					this.isPlayerPaused = false;
					this.animateRetreat();
				}, this.pauseDuration);
				return;
			}
		} else {
			this.handCurrentY -= this.animationSpeed;
			if (this.handCurrentY <= this.hand.getInitialY()) {
				this.handCurrentY = this.hand.getInitialY();
				this.isPlayerAnimating = false;
				this.isPlayerFalling = true;
			}
		}
	}

	getHand() {
		return this.hand;
	}
	getState() {
		return this.state;
	}
	setState(state) {
		this.state = state;
	}
	getHandCurrentY() {
		return this.handCurrentY;
	}
}

export default Player;