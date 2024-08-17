import game from "./game.js";	


const socket = new WebSocket('ws://127.0.0.1:8000/ws/game/');

// socket.onopen = function(e) {
//     console.log("Connected to server");
// };

// socket.onmessage = function(e) {
//     const data = JSON.parse(e.data);
//     console.log("Message from server:", data.message);
// };

// socket.onclose = function(e) {
//     console.log("Disconnected from server");
// };

// socket.onerror = function(e) {
//     console.error("WebSocket error observed:", e);
// };socket.send(JSON.stringify({message: "Hello, server!"}));

console.log("Game is running ...");
let Game = new game();

