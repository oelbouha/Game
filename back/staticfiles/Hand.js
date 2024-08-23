

class Hand {
	constructor(state, canvasHeight, PlayerHandImage) {
		this.PlayerHandImage = PlayerHandImage;
		this.state = state;
		this.initialY = -883 / 2;

		if (state === "buttom")
			this.initialY = canvasHeight - 883 / 2;
		this.currentY = this.initialY;
	}

	getImage() {
		return this.PlayerHandImage;
	}
	getcurrentY() {
		return this.currentY;
	}
	getInitialY() {
		return this.initialY;
	}
	setcurrentY(y) {
		this.currentY = y;
	}
	setInitialY(y) {
		this.initialY = y;
	}
}

export default Hand;