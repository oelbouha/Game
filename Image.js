
class CustomImage {
	constructor(src) {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.img = new Image();
		this.img.src = src;

		this.img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
   	};
	
	}
    draw(context) {
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
	setImageDimensions(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}	

export default CustomImage;