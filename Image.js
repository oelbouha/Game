
class CustomImage {
	constructor(src) {
		this.img = new Image();
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.img.src = src;
		this.loaded = false;
		this.img.onload = () => {
			this.loaded = true;
		};
		this.width = this.img.width;
		this.height = this.img.height;

		this.img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
   	};
	
	}
	getSize() {
		return { width: this.width, height: this.height, loaded: this.loaded };
	}

    draw(context, x, y) {
		this.x = x;
		this.y = y;
        if (this.img.complete) {
			context.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
			this.img.onload = () => {
				context.drawImage(this.img, this.x, this.y, this.width, this.height);
            };
        }
    }
	isClicked(x, y) {
		return (
			x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y &&
			y <= this.y + this.height
		);
	}
}	

export default CustomImage;