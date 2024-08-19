import game from "./game.js";	


// let socket;

// function connectWebSocket() {
//     socket = new WebSocket('ws://127.0.0.1:8000/ws/game/');

//     socket.onopen = function(e) {
//         console.log("Connected to server");
//         // Now it's safe to send messages
//         sendMessage("Hello, server!");
//     };

//     socket.onmessage = function(event) {
//         console.log("Message from server:", event.data);
//     };

//     socket.onerror = function(error) {
//         console.log("WebSocket Error: ", error);
//     };

//     socket.onclose = function(event) {
//         if (event.wasClean) {
//             console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
//         } else {
//             console.log('Connection died');
//         }
//     };
// }

// function sendMessage(message) {
//     if (socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify({message: message}));
//     } else {
//         console.log("WebSocket is not open. Message not sent.");
//     }
// }

// Call this function to initiate the connection
// connectWebSocket();
let gameInstance = new game();