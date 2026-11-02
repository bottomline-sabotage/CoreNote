const HostServer = require("./HostServer.js");
const GameServer = require("./GameServer.js");

const h = new HostServer( 2999, 'localhost', true);
const g = new GameServer( 3000,'localhost');