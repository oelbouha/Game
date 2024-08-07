import Hand from "./Hand.js";

class Player {
	constructor(position, initialRole, canvasHeight, PlayerHandImage, handSize) {
		this.opponent = null;
		this.isMissed = false;
		this.counter = 0;
		this.state = initialRole;
		this.hand = new Hand(position, canvasHeight, PlayerHandImage);
		this.position = position;
		this.isPlayerPaused = false;

		this.handWidth = handSize.width;
		this.handHeight = handSize.height;

		this.isPlayerAnimating = false;
		this.isPlayerRising = true;
		this.isPlayerFalling = true;

		this.pauseDuration = 700;
		this.animationSpeed = 100;
		this.animationFrame = null;
		
		this.maxAttackHeight = canvasHeight - 883 + 40;
		this.maxTopAttackHeight = canvasHeight - 1090;
		this.maxRetreatHeight = -700;
		this.maxRetreatButtomHeight = 250;
		this.maxRetreatToHeight = -250;

		this.hnadInitialY = this.hand.getInitialY();
		this.handCurrentY = this.hnadInitialY;
	}

	setOpponent(opponent) {
		this.opponent = opponent;
	}
	startAnimation(type) {
		this.isPlayerAnimating = true;
		if (type === "attack")
			this.animateAttack();
		else if (type === "retreat")
			this.animateRetreat();
	}

	isHitTheOpponent() {
		
		if (this.position === "buttom") {
			console.log("buttom Player attacking ...");
			
			let opponentHandY = this.opponent.handCurrentY + this.opponent.handWidth - 40;
			let playerHandY = this.handCurrentY;
			
			// console.log("opponent hand Y   |   " + opponentHandY);
			// console.log("player hand Y   |   " + playerHandY);
			
			if (this.opponent.isPlayerAnimating) {
				// console.log("opponent is animating ...");
				opponentHandY = this.opponent.handCurrentY + this.handHeight - 40;
				// console.log("opponent hand Y   |   ", opponentHandY);
			}
			if (this.handCurrentY <= opponentHandY ) {
				console.log("hit the opponent  ...");
				
				return true;
			}
		}
		else if (this.position === "top") {
			console.log("top Player attacking ...");

			let opponentHandY = this.opponent.handCurrentY;
			let playerHandY = this.handCurrentY + this.handHeight;

			if (this.opponent.isPlayerAnimating) {
				opponentHandY = this.opponent.handCurrentY;
			}
			// console.log("opponent hand Y   |   " + opponentHandY);
			// console.log("player hand Y   |   " + playerHandY);

			if (playerHandY >= opponentHandY) {
				console.log("hit the opponent  ...");
				return true;
			}
			return false;
		}
		return false;
	}
	update() {
		if (this.isPlayerAnimating) {
	
			if (this.animationType === "attack")
				this.animateAttack();
			else if (this.animationType === "retreat")
				this.animateRetreat();
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

		if (this.position == "top")
			this.animateTopAttack();
		else
			this.animateButtomAttack();

		this.update();

		if (this.isPlayerAnimating)
			this.animationFrame = requestAnimationFrame(() => this.animateAttack());
	}

	animateTopAttack() {
		if (this.isPlayerFalling) {
            // Falling (for player two, falling means moving down the screen)
            this.handCurrentY += this.animationSpeed;
            if (this.handCurrentY >= this.maxTopAttackHeight) {
                this.handCurrentY = this.maxTopAttackHeight;
				if (this.isHitTheOpponent()){
					this.counter += 1;
					// this.isMissed = false;
				}
				else {
					this.isMissed = true;
					// console.log("missed the attack ...", this.isMissed);
				}
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
	
				if (this.isHitTheOpponent()){
					// this.isMissed = false;
					this.counter += 1;
				}
				else {
					this.isMissed = true;
				}
    
				this.isPlayerRising = false;
                this.isPlayerPaused = true;
                setTimeout(() => {
                    this.isPlayerPaused = false;
                    this.animateButtomAttack();
                }, this.pauseDuration);
                return;
            }
        } else {
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

		if (this.position == "top")
			this.animateTopRetreat();
		else
			this.animateButtomRetreat();

		this.update();
		
		if (this.isPlayerAnimating)
			this.animationFrame = requestAnimationFrame(() => this.animateRetreat());
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
		// console.log("animating retreat ...");
		if (this.isPlayerFalling) {
			// console.log("this current Y   |   " + this.handCurrentY);
			// console.log("this max retreat   |   " + this.maxRetreatButtomHeight);
			this.handCurrentY += this.animationSpeed;
			if (this.handCurrentY >= this.maxRetreatButtomHeight) {

				this.handCurrentY = this.hand.getInitialY() + this.maxRetreatButtomHeight;
				// console.log("after update   |   " + this.handCurrentY);
				this.isPlayerFalling = false;
				this.isPlayerPaused = true;
				setTimeout(() => {
					this.isPlayerPaused = false;
					this.animateButtomRetreat();
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