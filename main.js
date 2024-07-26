let canvas = document.getElementById("gameCanvas");

canvas.style.backgroundColor = "white";

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

console.log("Window Width: " + windowWidth + " Window Height: " + windowHeight);

canvas.width = windowWidth;
canvas.height = windowHeight;

var context = canvas.getContext("2d");

var gameIcon = "assets/back.jpeg";
var background = "assets/background-images/back.jpeg";

class CustomImage {
    constructor(src, x, y, width, height) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = this.src;
    }

    drawImage(context) {
        // console.log("xpos: " + this.x + " ypos: " + this.y);
        // console.log("height: " + this.height + " width: " + this.width);
        
        if (this.img.complete) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height);
        } else {
            this.img.onload = () => {
                context.drawImage(this.img, this.x, this.y, this.width, this.height);
            };
        }
    }
	drawImage_center(context) {
		const canvasWidth = context.canvas.width;
		const canvasHeight = context.canvas.height;
		
		const xpos = (canvasWidth - this.width) / 2;
		const ypos = (canvasHeight - this.height) / 2;
		
		// console.log("center xpos: " + xpos + " center ypos: " + ypos);
		
		if (this.img.complete) {
			context.drawImage(this.img, xpos, ypos, this.width, this.height);
		} else {
			this.img.onload = () => {
				context.drawImage(this.img, xpos, ypos, this.width, this.height);
			};
		}
	}
}


class Button {
	constructor(x, y, width, height, text, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
		this.color = color;
	}
	
	draw(context) {
		const canvasWidth = context.canvas.width;
		const canvasHeight = context.canvas.height;

		const xpos = (canvasWidth - this.width) / 2;
		const ypos = (canvasHeight - this.height) / 2 + 230;

		context.fillStyle = this.color || "red";
		context.fillRect(xpos, ypos, this.width, this.height);
		
		context.strokeStyle = "black";
		context.lineWidth = 10;
	
		context.fillStyle = "black";
		context.font = "30px Arial";
		
	
		context.textAlign = "center";
		context.textBaseline = "middle";

		const textXpos =  xpos + this.width / 2;
		const textYpos = ypos + this.height / 2;
		context.fillText(this.text, textXpos, textYpos);
	}
	isClicked(x, y) {
		const canvasWidth = context.canvas.width;
		const canvasHeight = context.canvas.height;
	
		const buttonX = (canvasWidth - this.width) / 2;
		const buttonY = (canvasHeight - this.height) / 2 + 230;
	
		return (
			x >= buttonX &&
			x <= buttonX + this.width &&
			y >= buttonY &&
			y <= buttonY + this.height
		);
	}
}

let button = new Button(0, 0, 250, 70, "Start Game", "white");
let background_image = new CustomImage(background, 0, 0, windowWidth, windowHeight);
let icon_image = new CustomImage(gameIcon, 0, 0, 300, 300);

// Function to draw everything in the correct order
function drawAll() {
    background_image.drawImage(context);
    icon_image.drawImage_center(context);
    button.draw(context);
}

// Check if both images are loaded, then draw everything
let imagesLoaded = 0;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        drawAll();
    }
}

background_image.img.onload = onImageLoad;
icon_image.img.onload = onImageLoad;

canvas.addEventListener("click", function (event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	console.log("isClicked " + button.isClicked(x, y));
	// console.log("x: " + x + " y: " + y);
});
