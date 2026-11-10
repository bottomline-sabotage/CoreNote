const HostServer = require("./HostServer.js");
const GameServer = require("./GameServer.js");

const h = new HostServer( 3000, 'localhost', true);
const g = new GameServer( 4000,'localhost');

setTimeout(() => {
    console.log("Host Trade Secret: " + h.tradeSecret);
    console.log("Game Trade Secret: " + g.tradeSecret);
}, 30);

// Share trade secrets
h.gameTradeSecret = g.tradeSecret;
g.hostTradeSecret = h.tradeSecret;
