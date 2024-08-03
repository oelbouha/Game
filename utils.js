import CustomImage from "./Image.js";
import game_Canvas from "./Canvas.js";


let gameCanvas = new game_Canvas();
let context = gameCanvas.getContext();
let canvas = gameCanvas.getCanvas();

var gameIcon = "assets/back.jpeg";
var background = "assets/background-images/back.jpeg";
var title = "assets/title-sheet0.png";
var playButton = "assets/player.png";
var soundButton = "assets/sound-button.png";
var soundOffButton = "assets/sound-off-button.png";
var infoButton = "assets/info-button.png";

function resizeCanvas() {
    gameCanvas.setWidth(window.innerWidth);
	gameCanvas.setHeight(window.innerHeight);
    drawAll();
}


let playButton_image =  new CustomImage(playButton);
let soundButton_image = new CustomImage(soundButton);
let infoButton_image = new CustomImage(infoButton);
let title_image = new CustomImage(title);
let gameIcon_image = new CustomImage(gameIcon);

// let background_image = new CustomImage(background, 0, 0, windowWidth, windowHeight);

function draawline(context, x, y, canvasWidth , canvasHeight) {
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x, canvasHeight);
	context.strokeStyle = "black";
	context.lineWidth = 2;
	context.stroke();
}


function drawAll() {
	let canvasWidth = gameCanvas.getWidth();
	let canvasHeight = gameCanvas.getHeight();

	context.clearRect(0, 0, canvasWidth, canvasHeight);
 
	let margin = 10;
	let tophalf = canvasHeight / 2 - margin;
	let bottomhalf = canvasHeight / 2 + margin;
	
	context.fillStyle = '#BA4A9F';
	context.fillRect(0, 0, canvasWidth, tophalf);
	
	context.fillStyle = '#317BBF';
	context.fillRect(0, canvasHeight / 2, canvasWidth, bottomhalf);





	
	
}

drawAll();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener("click", handleCanvasClick);

function isClickedInsideImage(clickX, clickY, image) {
    let isInside = clickX >= image.x && clickX <= image.x + image.width &&
                   clickY >= image.y && clickY <= image.y + image.height;
    
    // console.log(`Click: (${clickX}, ${clickY})`);
    // console.log(`Image bounds: (${image.x}, ${image.y}) to (${image.x + image.width}, ${image.y + image.height})`);
    // console.log(`Is inside: ${isInside}`);
    
    return isInside;
}

function handleCanvasClick(event) {
	const rect = canvas.getBoundingClientRect();
	console.log(event.pageX, event.pageY)
	console.log(event.clientX, event.clientY)
	console.log(event.offsetX, event.offsetY)
	console.log(rect.x, rect.y)
	console.log(rect)
    const x = event.offsetX;
    const y = event.offsetY;

    drawAll();

	// console.log("canvas size: " + gameCanvas.getCanvasWidth() + " " + gameCanvas.getCanvasHeight());
	// console.log(`Click at (${x}, ${y})`);
    // Draw a small point where the click occurred
    context.fillStyle = 'red';
    context.fillRect(x, y, 10, 10);

    // Draw the bounds of the play button
    context.strokeStyle = 'blue';
    context.strokeRect(playButton_image.x, playButton_image.y, playButton_image.width, playButton_image.height);

    if (isClickedInsideImage(x, y, playButton_image)) {
        console.log("Play Button Clicked");
    } else {
        console.log("Play Button Not Clicked");
    }

    console.log(`Click at (${x}, ${y})`);
    console.log(`Play button at (${playButton_image.x}, ${playButton_image.y}), size: ${playButton_image.width}x${playButton_image.height}`);
}


/*
let titleWidth = gameCanvas.minWidth(500);
	let titleHeight = titleWidth;
	
	let canvas_centerX = gameCanvas.getCenterX(titleWidth);
	let y = canvasHeight * 0.1;
	
	draawline(context, canvas_centerX, 0, canvasWidth, canvasHeight);
	draawline(context, canvas_centerX + titleWidth, 0, canvasWidth, canvasHeight);

	title_image.setImageDimensions(canvas_centerX, y, titleWidth, titleHeight);
	
	let playButtonX = canvas_centerX;
	let playButtonY = y + titleHeight + 40;
	
	let playButtonWidth = gameCanvas.minWidth(500);
	let ScaleFactor = playButtonWidth / 500;
	let playButtonHeight = 150 * ScaleFactor;
	playButtonWidth = 500 * ScaleFactor;

	playButton_image.setImageDimensions(playButtonX, playButtonY, playButtonWidth, playButtonHeight);

	let soundButtonWidth = gameCanvas.minWidth(150);
	ScaleFactor = soundButtonWidth / 150;
	let soundButtonHeight = 100 * ScaleFactor;
	soundButtonWidth = 150 * ScaleFactor;

	let soundButtonX = canvas_centerX + 20;
	let soundButtonY = playButtonY + playButtonHeight + 40;

	soundButton_image.setImageDimensions(soundButtonX, soundButtonY, soundButtonWidth, soundButtonHeight);
	
	let infoButtonWidth = gameCanvas.minWidth(150);
	ScaleFactor = infoButtonWidth / 150;
	let infoButtonHeight = 100 * ScaleFactor;
	infoButtonWidth = 150 * ScaleFactor;

	let infoButtonX = canvas_centerX + titleWidth - infoButtonWidth - 20;
	let infoButtonY = soundButtonY;
	infoButton_image.setImageDimensions(infoButtonX, infoButtonY, infoButtonWidth, infoButtonHeight);


	// background_image.drawImage(context);
	title_image.drawImage(context);
	playButton_image.drawImage(context);
	soundButton_image.drawImage(context);
	infoButton_image.drawImage(context);
	
	context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText(`Canvas: ${gameCanvas.width}x${gameCanvas.height}`, 10, 30);
    context.fillText(`Image x y : ${soundButtonHeight}x${soundButtonWidth}`, 10, 60);

	context.fillStyle = 'red';
    context.fillRect(100, 100, 10, 10);
*/
