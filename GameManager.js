
import Player from './Player.js';

class GameManager {
	constructor(PlayerOne, PlayerTwo) {
		this.PlayerOne = PlayerOne;
		this.PlayerTwo = PlayerTwo;
	}
	update(player) {
		this.player = player;
		this.player.state = "retreat";
	}
}

export default GameManager;