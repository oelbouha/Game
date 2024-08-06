import Hand from "./Hand.js";


class Player {
	constructor(position, initialRole, canvasHeight, PlayerHandImage, handSize) {
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

		this.pauseDuration = 200;
		this.animationSpeed = 100;
		this.animationFrame = null;
		
		this.maxAttackHeight = canvasHeight - 883 + 40;
		this.maxRetreatHeight = -700;

		this.hnadInitialY = this.hand.getInitialY();
		this.handCurrentY = this.hnadInitialY;
	}

	startAnimation(type) {
		this.isPlayerAnimating = true;
		if (type === "attack")
			this.animateAttack();
		else if (type === "retreat")
			this.animateRetreat();
	}

	isHitTheOpponent() {
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
            if (this.handCurrentY >= this.maxAttackHeight) {
                this.handCurrentY = this.maxAttackHeight;
				if (this.isHitTheOpponent()){
					this.counter += 1;
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
					this.counter += 1;
				}
				else {
					console.log("missed the attack");
					this.isMissed = true;
					console.log("missed the attack   | " + this.isMissed);
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