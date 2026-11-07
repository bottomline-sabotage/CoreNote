const HostServer = require("./HostServer.js");
const GameServer = require("./GameServer.js");

const h = new HostServer( 3000, 'localhost', true);
const g = new GameServer( 4000,'localhost');