const HostServer = require("./HostServer.js");
const GameServer = require("./GameServer.js");

const IP = "192.168.68.54";

const h = new HostServer( 3000, IP, true);
const g = new GameServer( 4000,IP);

setTimeout(() => {
    console.log("Host Trade Secret: " + h.tradeSecret);
    console.log("Game Trade Secret: " + g.tradeSecret);
}, 30);

// Share trade secrets
h.gameTradeSecret = g.tradeSecret;
g.hostTradeSecret = h.tradeSecret;
