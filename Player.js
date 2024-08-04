

class Player {
	constructor(state, canvasHeight, PlayerHandImage) {
		this.hand = new Hand(state, canvasHeight, PlayerHandImage);
		this.state = state;
		this.isPlayerAnimating = false;
		this.isPlayerPaused = false;
		
		this.isPlayerRising = false;
		this.isPlayerFalling = false;

		if (this.state === "attack") {
			this.isPlayerRising = true;
		}

		this.pauseDuration = 1000;
		this.animationSpeed = 50;
		this.animationFrame = null;

		this.maxAttackHeight = canvasHeight - 883 + 40;
		this.maxRetreatHeight = -700;

	}

	animateAttack() {
		
	}
	animateRetreate() {

	}
	getHand() {
		return this.hand;
	}
	getState() {
		return this.state;
	}
}


class Hand {
	constructor(state, canvasHeight, PlayerHandImage) {
		this.PlayerHandImage = PlayerHandImage;
		this.state = state;
		this.initialY = - 883 / 2;
		
		if (state === "attack") {
			this.initialY = canvasHeight - 883 / 2;
		}
		this.currentY = this.initialY;
	}

	getImage() {
		return this.PlayerHandImage;
	}
	getCurrentY() {
		return this.currentY;
	}
	getInitialY() {
		return this.initialY;
	}
	setCurrentY(y) {
		this.currentY = y;
	}
	setInitialY(y) {
		this.initialY = y;
	}
}


export default Player;