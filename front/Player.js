import CustomImage from "./image.js";
import Hand from "./Hand.js";


// Variables for shaking effect
let shakeDuration = 500; // Duration of the shake in milliseconds
let shakeMagnitude = 10; // Magnitude of the shake
let shakeTime = 0;


class Player {
	constructor(position, initialRole, canvasHeight, PlayerHandImage, handSize, context, assets) {
		this.assets = assets;
		this.context = context;
		this.maxScore = 5;
		this.harmLevel = 6;
		this.win = false;
		this.opponent = null;
		this.isMissed = false;
		this.score = 0;
		this.state = initialRole;
		this.hand = new Hand(position, canvasHeight, PlayerHandImage);
		
		this.slapEffectImage = new CustomImage(STATIC_URL + "/assets/slap-effect.png");
		this.slapEffectImage1 = new CustomImage(STATIC_URL + "/assets/slap.png");
		this.missedImage = new CustomImage(STATIC_URL + "/assets/missed.png");

		this.position = position;
		this.isPlayerPaused = false;

		this.handWidth = handSize.width;
		this.handHeight = handSize.height;

		this.isPlayerAnimating = false;
		this.isPlayerRising = true;
		this.isPlayerFalling = true;

		this.pauseDuration = 400;
		this.animationSpeed = 100;
		this.animationFrame = null;
		
		this.maxButtomAttack =  160;
		this.maxTopAttackHeight = canvasHeight - 1040;
	
		this.maxTopRetreat = -700;
		this.maxRetreatButtomHeight = 250;

		this.hnadInitialY = this.hand.getInitialY();
		this.handCurrentY = this.hnadInitialY;

		this.isPlayerHit = false

		this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
        this.isShaking = false;

		this.isFrozen = false;
	}

	setOpponent(opponent) {
		this.opponent = opponent;
	}

	shakeCanvas() {
        if (shakeTime > 0) {
            this.isShaking = true;
            // Calculate random shake offsets
            this.shakeOffsetX = Math.random() * shakeMagnitude - shakeMagnitude / 2;
            this.shakeOffsetY = Math.random() * shakeMagnitude - shakeMagnitude / 2;

            // Reduce the shake time
            shakeTime -= 16; // Assuming 60 frames per second

            // Continue shaking until time runs out
            requestAnimationFrame(() => this.shakeCanvas());
        } else {
            // Reset shake offsets
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
            this.isShaking = false;
        }
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
			let opponentHandY = this.opponent.handCurrentY + this.opponent.handHeight - 40;
			let playerHandY = this.handCurrentY;

			if (this.opponent.isPlayerAnimating)
				opponentHandY = this.opponent.handCurrentY + this.handHeight - 40;

			if (playerHandY <= opponentHandY )
				return true;
		}
		else if (this.position === "top") {
			let opponentHandY = this.opponent.handCurrentY + 40;

			let playerHandY = this.handCurrentY + this.handHeight;

			if (this.opponent.isPlayerAnimating)
				opponentHandY = this.opponent.handCurrentY + 40;

			if (playerHandY >= opponentHandY)
				return true;
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
	
	switchRoles() {
		if (this.position === "top" && this.state === "attack") {
			this.state = "retreat";
			this.opponent.state = "attack";
		}
		else  if (this.position === "top" && this.state === "retreat") {
			this.opponent.state = "retreat";
			this.state = "attack";
		}
		else if (this.position === "buttom" && this.state === "attack") {
			this.state = "retreat";
			this.opponent.state = "attack";
		}
		else if (this.position === "buttom" && this.state === "retreat") {
			this.opponent.state = "retreat";
			this.state = "attack";
		}
		this.isMissed = false;
	}

	animateHand() {
		if (!this.isPlayerAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}
		if (this.postion === "top")
			this.animateTopHand();
		else
			this.animateButtomHand();
		if (this.isPlayerAnimating)
			this.animationFrame = requestAnimationFrame(() => this.animateHand());
	}

	async handleHit() {
		this.score += 1;
		this.opponent.isPlayerHit = true;
	
		this.slapEffectImage.draw(this.context, 1200 / 2 - this.slapEffectImage.width / 2, this.handCurrentY);
		this.slapEffectImage1.draw(this.context, 1200 / 2 - this.slapEffectImage1.width / 2, this.opponent.handCurrentY);
	
		// Start shaking the canvas
		shakeTime = shakeDuration;
		this.shakeCanvas();
	
		// Freeze everything for a second
		this.isFrozen = true;
		this.opponent.isFrozen = true;
		this.isPlayerAnimating = false;
		this.opponent.isPlayerAnimating = false;
	
		return new Promise(resolve => {
			setTimeout(() => {
				this.isFrozen = false;
				this.opponent.isFrozen = false;
				this.isPlayerAnimating = true;
				this.opponent.isPlayerAnimating = true;
	
				// Return hand to initial position
				this.handCurrentY = this.hand.getInitialY();
				if (this.position === "top") {
					this.isPlayerFalling = true;
				} else {
					this.isPlayerRising = true;
				}
	
				// Check for win condition after animation is complete
				if (this.score >= this.maxScore) {
					this.win = true;
				}
	
				resolve();
			}, this.pauseDuration);
		});
	}

	animateAttack() {
		// console.log("animating attack ...");
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

		if (this.isPlayerAnimating)
			this.animationFrame = requestAnimationFrame(() => this.animateAttack());
		
		this.update();
		
		if (this.isPlayerAnimating == false && this.isMissed)
			this.switchRoles();
	}

	async animateTopAttack() {
		if (this.isPlayerFalling) {
            this.handCurrentY += this.animationSpeed;
            if (this.handCurrentY >= this.maxTopAttackHeight) {
                this.handCurrentY = this.maxTopAttackHeight;
				if (this.isHitTheOpponent()) {
					await this.handleHit();
				} else {
					this.isMissed = true;
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
            this.handCurrentY -= this.animationSpeed;
            if (this.handCurrentY <= this.hand.getInitialY()) {
                this.handCurrentY = this.hand.getInitialY();
                this.isPlayerAnimating = false;
                this.isPlayerFalling = true;
            }
        }
	}

	async animateButtomAttack() {
		if (this.isPlayerRising) {
			this.handCurrentY -= this.animationSpeed;
			if (this.handCurrentY <= this.maxButtomAttack) {
				this.handCurrentY = this.maxButtomAttack;

				if (this.isHitTheOpponent()) {
					await this.handleHit();
				} else {
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
		if (!this.isPlayerAnimating) {
			cancelAnimationFrame(this.animationFrame);
			return;
		}


		if (this.isPlayerPaused) {
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
			if (this.handCurrentY <= this.maxTopRetreat){
				this.handCurrentY = this.maxTopRetreat;
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
			if (this.handCurrentY >= this.maxRetreatButtomHeight) {
				this.handCurrentY = this.hand.getInitialY() + this.maxRetreatButtomHeight;
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