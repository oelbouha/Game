

import offlineGame from "./offlineGame.js";

const imageAnimationTime = 500
const animationTime = imageAnimationTime * 4

let playerTwoHand = null;
let playerOneHand = null;

const backgroundColors = [
	"#ffeef1",
	"#6182cd",
	"#bd6f5a",
	"#84d0ff",
	"#bd6f5a",
	"#ecedf0",
	"#bd6f5a",
	"#ffffff",
	"#ffbc97",
	"#bd6f5a",
	"#ffbc97",
	"#bd6f5a",
	"#ffbc97",
	"#ffbc97"
]

const handImages = [
	STATIC_URL + "assets/hands/hand5.png",
	STATIC_URL + "assets/hands/hand7.png",
	STATIC_URL + "assets/hands/hand3.png",
	STATIC_URL + "assets/hands/hand2.png",
	STATIC_URL + "assets/hands/hand1.png",
	STATIC_URL + "assets/hands/hand6.png",
	STATIC_URL + "assets/hands/hand8.png",
	STATIC_URL + "assets/hands/hand9.png",
	STATIC_URL + "assets/hands/hand11.png",
	STATIC_URL + "assets/hands/hand12.png",
	STATIC_URL + "assets/hands/hand13.png",
	STATIC_URL + "assets/hands/hand14.png",
	STATIC_URL + "assets/hands/hand15.png",
	STATIC_URL + "assets/hands/hand16.png"
]

class HandSelection {
    constructor() {
        // DOM Element references
        this.slideContainer = document.getElementById("slide-container");
        this.background = document.getElementById("image-container");
        this.playerHandImage = document.getElementById("playerHandImage");
        this.playerContainer = document.getElementById("player-container");
        this.readyBtn = document.getElementById("readyBtn");
        this.counter = document.getElementById("counter");
        this.imageContainer = document.getElementById("image");
        this.gameHome = document.getElementById("game-home");
        this.playerText = document.getElementById("info");
        this.frontDiv = document.getElementById("gameFront");
        this.nextBtn = document.getElementById("nextBtn");
        this.prevBtn = document.getElementById("prevBtn");

        // State variables
        this.isAnimating = false;
        this.imageIsAnimating = false;
        this.currentIndex = 0;
        this.playerTwoHand = null;
        this.playerOneHand = null;

        this.imageAnimationTime = 300; // milliseconds
        this.animationTime = this.imageAnimationTime * 3;

        // Initialize UI
		this.initializeUI();
		this.setupEventListeners();
		this.initAnimation()
    }
	
	start() {
		this.setupPlayerOneHand()
	}
    initializeUI() {
        // Create style element
        this.styleEl = document.createElement('style');
        document.head.appendChild(this.styleEl);

        // Set initial states
        this.counter.textContent = `1 / ${handImages.length}`;
        this.imageContainer.style.display = "none";

        // Create progress dots
        for (let i = 0; i < handImages.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!this.imageIsAnimating) {
					this.imageIsAnimating = true;
                    this.setActive(i);
                }
            });
            this.slideContainer.appendChild(dot);
        }
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.handleNextClick());
        this.prevBtn.addEventListener('click', () => this.handlePrevClick());
    }

    handleNextClick() {
        if (this.imageIsAnimating) return;
        
        this.playerText.style.display = "none";
        this.playerHandImage.classList.add('animate-handOut');
        
        this.currentIndex = (this.currentIndex + 1) % handImages.length;
        this.updateImage();
        this.setActive(this.currentIndex);
    }

    handlePrevClick() {
        if (this.imageIsAnimating) return;

        this.playerHandImage.classList.add('animate-handOut');
        
        this.currentIndex = (this.currentIndex - 1 + handImages.length) % handImages.length;
        this.updateImage();
        this.setActive(this.currentIndex);
    }

    setupPlayerOneHand() {
        this.playerText.textContent = "Choose Your Hand";
        
        this.readyBtn.addEventListener('click', () => {
            this.playerContainer.classList.add('slideOut');
            this.playerContainer.classList.remove('animate-in', 'animate-out');
            void this.playerContainer.offsetWidth; // Trigger reflow
            this.playerContainer.classList.add('animate-in');
            
            this.gameHome.style.flexDirection = "row-reverse";
            playerOneHand = handImages[this.currentIndex];
            this.setupPlayerTwoHand();
        }, { once: true });
    }

    setupPlayerTwoHand() {
        this.playerText.textContent = "Choose Your Hand";
        this.playerText.style.display = "block";
        this.currentIndex = 0;
        this.setActive(0);
        
        this.readyBtn.addEventListener('click', () => {
            playerTwoHand = handImages[this.currentIndex];
            this.startGame();
        }, { once: true });
    }

    initAnimation() {
        this.background.classList.add('animate-in');
        this.background.style.background = backgroundColors[this.currentIndex];
        this.imageIsAnimating = true;
        
        setTimeout(() => {
            this.imageContainer.style.display = "flex";
            this.imageContainer.classList.add('animate-in');
            this.imageIsAnimating = false;
            this.playerHandImage.classList.add('animate-handIn');
        }, this.imageAnimationTime);
        
        this.imageContainer.style.background = backgroundColors[this.currentIndex];
    }

    setActive(index) {
        const dots = this.slideContainer.children;
        Array.from(dots).forEach(dot => dot.classList.remove('active'));
        
        this.styleEl.textContent = `
            .active {
                background: ${backgroundColors[index]};
                transform: scale(1.2);
                transition: all 0.3s ease;
            }
        `;
        
        dots[index].classList.add('active');
        this.counter.textContent = `${index + 1} / ${handImages.length}`;
        this.currentIndex = index;
        this.updateImage();
        
        setTimeout(() => {
            this.imageIsAnimating = false;
        }, this.animationTime);
    }

    updateImage() {
        this.background.classList.remove('animate-in', 'animate-out');
        void this.background.offsetWidth; // Trigger reflow
        this.background.classList.add('animate-in');
        this.background.style.background = backgroundColors[this.currentIndex];
        
        this.imageContainer.classList.remove('animate-in', 'animate-out');
        void this.imageContainer.offsetWidth; // Trigger reflow
        this.imageContainer.classList.add('animate-in');
        this.imageContainer.style.background = backgroundColors[this.currentIndex];
        
        this.imageIsAnimating = true;
        
        setTimeout(() => {
            this.playerHandImage.classList.remove('animate-handIn', 'animate-handOut');
            void this.playerHandImage.offsetWidth; // Trigger reflow
            this.playerHandImage.src = handImages[this.currentIndex];
            this.playerHandImage.classList.add('animate-handIn');
        }, this.imageAnimationTime);
        
        setTimeout(() => {
            this.imageIsAnimating = false;
        }, this.animationTime);
    }

    startGame() {
        // Implementation needed
		this.frontDiv.style.display = 'none';
		
		let offline_game = new offlineGame(playerTwoHand, playerOneHand);
		offline_game.startGame();
        console.log('Game started with hands:', playerOneHand, playerTwoHand);
    }
}
export default HandSelection;




let online_game = new HandSelection();
online_game.start();