const _Server = require("./_Server.js");

class GameServer extends _Server {
    constructor(port, ip) {
        super(port, ip);
    }
};

module.exports = GameServer;