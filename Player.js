

class Player {
	constructor(state) {
		this.state = state;
		this.isPlayerAnimating = false;
		this.isPlayerPaused = false;
		
		this.isPlayerRising = false;
		this.isPlayerFalling = false;
		if (this.state === "attack") {
			this.isPlayerRising = true;
		}
		this.animationSpeed = 5;
		this.pauseDuration = 1000;
		this.maxAttackHeight = 200;
		this.maxRetreatHeight = -700;
	}
}

class Hand {
	constructor(hand) {
		this.hand = hand;
		this.currentY = 0;
		this.initialY = 0;
	}

}


export default Player;