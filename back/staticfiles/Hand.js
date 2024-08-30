

class Hand {
	constructor(state, canvasHeight, PlayerHandImage) {
		this.PlayerHandImage = PlayerHandImage;
		this.state = state;

		this.initialY = -(this.PlayerHandImage.getHeight() / 2);
		if (state === "buttom")
			this.initialY = canvasHeight - (this.PlayerHandImage.getHeight() / 2);
		this.currentY = this.initialY;
	}

	getWidth() {
		return this.PlayerHandImage.width;
	}
	
	getHeight() {
		return this.PlayerHandImage.height;
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