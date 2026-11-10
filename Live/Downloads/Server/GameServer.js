const _Server = require("./_Server.js");
const WebSocket = require('ws');

const WebSocketCodes = {
    OVERWRITE_LOGIN: 5,
    NOT_VERIFIED: 6,
};

class GameServer extends _Server {
    messageHandler(message) {
        const data = JSON.parse(message);
        const id = data.id;

        switch(data.xAction) {

        }
    }

    sendMessage(id, message = "", cb = () => {}) {
        const wsData = this.wsById(id);
        if(!wsData)
            return false;

        wsData.ws.send(message, cb);
    }

    accountVerification(dataJson) {
        // Note: accounts are purely client generated; their ids come from the client (likely just uuids). We trust the client here.
        return true;
    }

    wsById(id) {
        return this.knownUsers[id];
    }

    logIn(ws, message) {
        const data = JSON.parse(message);

        if(!this.accountVerification(data)) {
            return false;
        }   
        
        if(wsById(data.id)) {
            wsById(data.id).ws.close(WebSocketCodes.OVERWRITE_LOGIN, "Another user logged in");
        }

        this.knownUsers[data.id] = {
            ws: ws
        }

        return data.id;
    }

    constructor(port, ip) {
        super(port, ip);

        const wss = new WebSocket.Server({"port": port, "host": ip});

        this.tradeSecret = this.generateSecretGame();

        console.log(`Hosting Game Server at ws://${ip}:${port}`);

        this.knownUsers = {};

        wss.on('connection', (ws) => {
            let hasInit = false;
            let id = false;


            ws.on('message', (message) => {    
                if(hasInit) {
                    try {
                        this.messageHandler(message);
                    } catch (err) {
                        console.error(err);
                    }
                    return;
                }
                let success = false;
                try {
                    id = this.logIn(ws, message);
                    success = id != false;
                } catch (err) {
                    console.error(err);
                }
                if(!success)
                    ws.close(WebSocketCodes.NOT_VERIFIED, "Not verified");
            });

            ws.on('close', () => {
                console.log('Client disconnected');

                delete this.knownUsers[id];
            });
        });
    }

    
};

module.exports = GameServer;
