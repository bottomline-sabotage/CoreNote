const _Server = require("./_Server.js");
const http = require("http");
const fs = require("fs");
const fsp = require("fs").promises;
const open = require("open");

class HostServer extends _Server {
    constructor(port, ip, openInBrowser) {
        super(port, ip);

        this.server = http.createServer((req, res) => {

            const {url, method} = req;

            res.writeHead(200, {'content-type': 'text/plain'});
            res.end(`Test at ${url} with ${method}\n`);
        });

        this.server.listen(this.port, this.ip, () => { 
            open.default(`http://${this.ip}:${this.port}`);
        });

    }
};

module.exports = HostServer;