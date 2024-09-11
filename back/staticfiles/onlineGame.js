import game_Canvas from './canvas.js';
import CustomImage from './image.js';
import Player from './Player.js';
import game from './game.js'


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
	updateImage();
});

prevBtn.addEventListener('click', function () {
	--index;
	if (index < 0)
		index = 0;
	updateImage();
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class onlineGame extends game {
	constructor() {
		super();
		this.socket = new WebSocket('ws://127.0.0.1:8000/ws/game/');
		this.start_game = false;
		this.ready = false;
		this.init_game = false;
		this.isPlayerOne = false;
		this.isPlayerTwo = false;
		this.playerOneHand = null;
		this.playerTwoHand = null;
		this.connectWebSocket();
		
	}

	async setupHands() {
		while (!this.start_game) {
			this.showLoadingScreen("Waiting For Other Player ...");
			await sleep(200);
		}

		// setup hands for player ..
		console.log ("choosing hands  .....");
		if (this.isPlayerOne) {
			playerText.textContent = "Choose Player One Hand";
			readybtn.addEventListener('click', function() {
				playerOneHnad = handImages[index];
				console.log("setting up player one ...", playerOneHnad);
				fronDiv.style.display = 'none';
			}, {once: true});
		}
		
		else if (this.isPlayerTwo) {
			playerText.textContent = "Choose Player Two Hand";
			index = 0;
			updateImage();
			readybtn.addEventListener('click', function() {
				playerTwoHnad = handImages[index];
				fronDiv.style.display = 'none';
			}, {once: true});
		}
		
		if (this.isPlayerOne) {
			while (playerOneHnad == null) {
				await sleep(200);
			}
			this.sendMessage({"action": "chose hand", "player": "player one" , "hand": playerOneHnad});
		}
		if (this.isPlayerTwo) {
			while (playerTwoHnad == null) {
				await sleep(200);
			}
			this.sendMessage({"action": "chose hand", "player": "player two" , "hand": playerTwoHnad});
		}
	}

	async initGame() {
		while (!this.ready) {
			await sleep(300);
		}

		let playerOneHand = new CustomImage(this.playerOneHand);
		let playerTwoHand = new CustomImage(this.playerTwoHand);

		// this sleep is for image to load and then use it || fix it
		await sleep(200);
	
		this.playerOne = new Player("top", "retreat", this.gameCanvas, playerOneHand, this.context, this.assets, this);
		this.playerTwo = new Player("buttom", "attack", this.gameCanvas, playerTwoHand, this.context, this.assets, this);
	
		this.playerOne.initPlayer();
		this.playerTwo.initPlayer();
		
		this.playerOne.setOpponent(this.playerTwo);
		this.playerTwo.setOpponent(this.playerOne);

		super.setPlayerOneHand(this.playerOneHand);
		super.setPlayerTwoHand(this.playerTwoHand);

	}
	
	async startGame() {
		await this.setupHands();
		await this.initGame();
		await this.loadGame("starting game", 300);
		this.gameLoop();
	}

	connectWebSocket() {
		this.socket.onopen = (e) => {
			console.log("Connected to server");
			// this.sendMessage("Hello, server!");
		};
		
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			
			const whichPlayer = data.which_player;
			const message = data.message;

			if (whichPlayer == "Player 1")
				this.isPlayerOne = true;
			if (whichPlayer == "Player 2")
				this.isPlayerTwo = true;
			
			if (message === "Start Game") {
				this.start_game = true;
				return ;
			}
			if (message === "init Game") {
				this.init_game = true;
				return ;
			}
			this.handleServerMessage(message);
		};
	
		this.socket.onerror = (error) => {
			console.log("WebSocket Error: ", error);
		};

		this.socket.onclose = (event) => {
			if (event.wasClean) {
				console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.log('Connection died');
			}
		};
	}

	async handleServerMessage(data) {
		const action = data.action;
		const player = data.player;
		const hand = data.hand;

		// console.log("recieve message :", action, player);
		
		if (action == "attack") {
			if (player == "playerOne")
			this.playerOne.startAnimation(action);
		else
		this.playerTwo.startAnimation(action);
	}
	if (action == "retreat" ) {
		if (player == "playerOne") {
			this.playerOne.startAnimation("retreat");
		}
		else {
			this.playerTwo.startAnimation("retreat");
		}
	}
	if (action == "Rematch")
		await this.gameOver();
		if (action == "chose hand") {
	
		console.log("received ::", data);
			if (player == "player one") {
				this.playerOneHand = hand;
				// console.log("player one hand ", this.playerOneHand);
			}
			else if (player == "player two") {
				this.playerTwoHand = hand;
				// console.log("player two hand ", this.playerTwoHand);
			}
		if (this.playerOneHand && this.playerTwoHand)
			this.ready = true;
		}
	}

	sendMessage(message) {
		if (this.socket.readyState === WebSocket.OPEN) {
			console.log ("message send :", message);
			this.socket.send(JSON.stringify({message: message}));
		} else {
			console.log("WebSocket is not open. Message not sent.");
		}
	}

	handlePlayeAction(action, key) {
		if (this.playerOne.isFrozen || this.playerTwo.isFrozen)
			return ;

		const player = key == "s" || key == "w" || key == "mouseTop" ? "playerOne": "playerTwo";

		const whichPlayer = player == "playerOne" ? this.playerOne : this.playerTwo;

		this.sendMessage({action: action, player: player});
	}

	handleKeyPress(event) {
		const key = event.key;

		if (this.playerOne.win || this.playerTwo.win)
			return ;
		
		// console.log("key :: ", key, "player ::", this.isPlayerOne, this.isPlayerTwo);

		if (key == "w" && this.playerOne.state == "retreat" && this.isPlayerOne)
			this.handlePlayeAction("retreat", key)
		else if (key == "ArrowDown" && this.playerTwo.state == "retreat" && this.isPlayerTwo)
			this.handlePlayeAction("retreat", key)
	
		else if (key == "s" && this.playerOne.state == "attack" && this.isPlayerOne)
			this.handlePlayeAction("attack", key)
		else if (key == "ArrowUp" && this.playerTwo.state == "attack" && this.isPlayerTwo)
			this.handlePlayeAction("attack", key)
	}

	handleCanvasClick(event) {
        let rect = this.canvas.getBoundingClientRect();
        let x = event.pageX - rect.left;
        let y = event.pageY - rect.top;

        if (this.isButtonClicked(x, y, this.topButton) && this.isPlayerOne) {
			if (this.playerOne.win || this.playerTwo.win) {
				return this.handlePlayeAction("Rematch", "mouseTop");
			}
			this.handlePlayeAction(this.playerOne.state, "mouseTop");
		}
		if (this.isButtonClicked(x, y, this.bottomButton) && this.isPlayerTwo) {
			if (this.playerOne.win || this.playerTwo.win) {
				return this.handlePlayeAction("Rematch", "mouseButtom");
			}
			this.handlePlayeAction(this.playerTwo.state, "mouseButtom");
        }
    }
}

export default onlineGame;





