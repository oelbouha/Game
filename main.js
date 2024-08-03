import game from "./game.js";	

let Game = new game();
Game.drawAll();

// let canvas = Game.getCanvas();

// canvas.addEventListener("click", handleCanvasClick);

// function handleCanvasClick(event) {

// 	const rect = canvas.getBoundingClientRect();
// 	console.log(event);
// 	console.log(event.pageX, event.pageY)
// 	// console.log(event.clientX, event.clientY)
// 	// console.log(event.offsetX, event.offsetY)
// 	// console.log(rect.x, rect.y)
// 	// console.log(rect)
// 	// const x = event.clientX - rect.left;
// 	// const y = event.clientY - rect.top;
// 	const x = 100;
// 	const y = 100;


// 	// console.log("canvas size: " + this.gameCanvas.getCanvasWidth() + " " + this.gameCanvas.getCanvasHeight());
// 	console.log(`Click at (${x}, ${y})`);
// 	// Draw a small point where the click occurred
// }

