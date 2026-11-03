const _Server = require("./_Server.js");
const http = require("http");
const url = require('url');
const fs = require("fs");
const fsp = require("fs").promises;
const open = require("open");
const path = require("path");

class HostServer extends _Server {

    post(req, res) {
        
    }

    async getTradeSecretPage(req, res, filePath) {
        this.hadTradeSecret = true; // stops this function

        let t = await fsp.readFile(filePath, {encoding: "utf-8"});
        t = t.replaceAll('TRADE_SECRET', this.tradeSecret);

        res.writeHead(200, {'content-type': "text/html; charset=utf-8"});
        res.end(t);
    }

    async get(req, res) {
        
        let decodedURI;
        try {
            decodedURI = decodeURIComponent(req.url);
        } catch (error) { decodedURI = "/404.html" }

        // Get File PATH
        
        let filePath = path.join(__dirname, "Public", decodedURI);
        if(filePath === path.join(__dirname, "Public", '/')) {
            filePath = path.join(__dirname, 'Public/index.html');
        }

        // Default as HTML
        if(!decodedURI.includes('.')) {
            decodedURI = decodedURI + '.html';
            filePath = path.join(__dirname, "Public", decodedURI);
            if(filePath === path.join(__dirname, "Public", '/')) {
                filePath = path.join(__dirname, 'Public/index.html');
            }
        }
    
        if(!this.hadTradeSecret && decodedURI.toLowerCase() == "/tradesecret.html") {
            this.getTradeSecretPage(req, res, filePath); return;
        }

        let alreadyErrored = false;
        const serveFile = (fp, callback) => {
            filePath = fp;
            fs.stat(fp, callback);  
        };
        
        const cb = (err, stat) => {
            if(err !== null) {
                if(alreadyErrored) {
                    console.error("Unknown Error: " + err);
                    res.writeHead(500, { });
                    res.end(`Unknown Error!`);
                } else {
                    alreadyErrored = true;
                    serveFile(path.join(__dirname, 'Public/404.html'), cb);
                }
                return;
            }

            const ct = this.getContentType(filePath);
            const fileSize = stat.size;
            
            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Length', fileSize);
            res.setHeader('Content-Type', ct);

            if(req.headers.range) {
                const range = req.headers.range;
                const [start, end] = range.replace(/bytes=/, '').split('-').map(Number);
                const chunkStart = start || 0;
                const chunkEnd = end || fileSize - 1;
            
                if (chunkStart >= fileSize || chunkEnd >= fileSize) {
                    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
                    res.end();
                    return;
                }
                
                res.writeHead(206, {
                    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
                    'Content-Length': chunkEnd - chunkStart + 1
                });

                
                fs.createReadStream(filePath, { start: chunkStart, end: chunkEnd }).pipe(res);
            } else {
                if(alreadyErrored) {
                    res.writeHead(400);
                } else {
                    res.writeHead(200);
                }
                fs.createReadStream(filePath).pipe(res);

            }    
        };
        serveFile(filePath, cb);
        
        
        
    }

    constructor(port, ip, openInBrowser) {
        super(port, ip);

        this.hadTradeSecret = false;
        this.tradeSecret = this.generateSecret();
        this.server = http.createServer(async (req, res) => {

            const {method} = req;

            try {
                if(method == "POST")
                    this.post(req, res);
                else 
                    this.get(req, res);
            } catch (err) {
                console.error("Unknown Error: " + err);
                res.writeHead(500, { });
                res.end(`Unknown Error!`);
            }
        });

        this.server.listen(this.port, this.ip, () => { 
            if(openInBrowser)
                open.default(`http://${this.ip}:${this.port}/TradeSecret`);
        });

    }
};

module.exports = HostServer;