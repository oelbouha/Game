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

const playerHandImage = document.getElementById("playerHandImage");
const readybtn = document.getElementById("readyBtn");

const playerText = document.getElementById("playerText");
const fronDiv = document.getElementById("gameFront");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");


let  playerTwoHnad = null;
let  playerOneHnad = null;

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

function startOffline() {
	function	startGame() {
		fronDiv.style.display = 'none';
		let offline_game = new offlineGame(playerOneHnad, playerTwoHnad);
		offline_game.startGame();
	}

	function	setupPlayerOneHand() {
		playerText.textContent = "Choose Player One Hand";
		readybtn.addEventListener('click', function() {
			playerOneHnad = handImages[index];
			setupPlayerTwoHand();
		}, {once: true});
	}

	function setupPlayerTwoHand() {
		playerText.textContent = "Choose Player Two Hand";
		index = 0;
		updateImage();
		readybtn.addEventListener('click', function() {
			playerTwoHnad = handImages[index];
			startGame();
		}, {once: true});
	}

	setupPlayerOneHand();
}

// startOffline();
let online_game = new onlineGame();
online_game.startGame();