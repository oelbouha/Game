import onlineGame from "./onlineGame.js";	
import offlineGame from "./offlineGame.js";


const handImages = [
	STATIC_URL + "/assets/hands/hand1.png",
	STATIC_URL + "/assets/hands/hand2.png",
	STATIC_URL + "/assets/hands/hand3.png",
	STATIC_URL + "/assets/hands/hand4.png",
	STATIC_URL + "/assets/hands/hand5.png",
	STATIC_URL + "/assets/hands/hand6.png",
	STATIC_URL + "/assets/hands/hand7.png",
	STATIC_URL + "/assets/hands/hand8.png",
	STATIC_URL + "/assets/hands/hand9.png",
	STATIC_URL + "/assets/hands/hand10.png",
	STATIC_URL + "/assets/hands/hand11.png",
	STATIC_URL + "/assets/hands/hand12.png",
	STATIC_URL + "/assets/hands/hand13.png",
	STATIC_URL + "/assets/hands/hand14.png",
	STATIC_URL + "/assets/hands/hand15.png",
	STATIC_URL + "/assets/hands/hand16.png"
]

let playerHandImage = document.getElementById("playerHandImage");


const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");


let index = 0;

function updateImage() {
	playerHandImage.src = handImages[index];
}

nextBtn.addEventListener('click', function () {
	++index;
	if (index >= handImages.length)
		index = handImages.length - 1;
	console.log("changig image to : next image -> ", index);
	updateImage("player one");
});

prevBtn.addEventListener('click', function () {
	--index;
	if (index < 0)
	index = 0;
	console.log("changig image to : prev image -> ", index);
	updateImage("player one");
});




let gameInstance = new offlineGame();

gameInstance.startGame();




// const playerOneNextBtn = document.getElementById("playerOneNextButton");
// const playerOnePrevBtn = document.getElementById("playeronePreviousButton");

// const playerTwoNextBtn = document.getElementById("playerTwoNextButton");
// const playerTwoPrevBtn = document.getElementById("playerTwoPreviousButton");


// let index = 0;
// let playerTwoIndex = 0;

// console.log("image > ", handImages[0]);

// function updateImage(player) {
// 	if (player == "player one") {
// 		console.log("src :: ", playerOneImage.src , index, handImages.length);
// 		playerOneImage.src = handImages[index];
// 		console.log("src :: ", playerOneImage.src);
// 	}
// 	else {
// 		playerTwoImage.src = handImages[playerTwoIndex];
// 	}
// }

// playerOneNextBtn.addEventListener('click', function () {
// 	++index;
// 	if (index > handImages.length)
// 		index = handImages.length;
// 	updateImage("player one");
// });

// playerOnePrevBtn.addEventListener('click', function () {
// 	--index;
// 	if (index < 0)
// 	index = 0;
// updateImage("player one");
// });

// playerTwoNextBtn.addEventListener('click', function () {
// 	++playerTwoIndex;
// 	if (index > handImages.length)
// 		index = handImages.length;
// 	updateImage("player two");
// });

// playerTwoPrevBtn.addEventListener('click', function () {
// 	--playerTwoIndex;
// 	if (index < 0)
// 		index = 0;
// 	updateImage("player two");
// });