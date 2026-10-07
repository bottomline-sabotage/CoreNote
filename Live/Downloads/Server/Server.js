// Node.js - v22.2.0

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Color = require('./Scripts/Color.js');
const Feet = require('./Scripts/Feet.js');
const GameState = require('./Scripts/GameState.js');
const ServerCommunicator = require('./Scripts/ServerCommunicator.js');
const Accounts = require('./Scripts/Accounts.js');
const jszip = require('jszip');

// Define the port
const PORT = 9091;
const IP_ADDRESS = '192.168.1.164'; // TODO: auto populate

global.gameState = new GameState();

global.gameState.host = `${IP_ADDRESS}:${PORT}`;

global.serverConfigFilePath = __dirname;

global.gameState._port = PORT;
global.gameState._IP_ADDRESS = IP_ADDRESS;

let lastZipCreation = null;

// Define Readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});  

fs.promises.readFile(`${__dirname}/config.json`, {"encoding": "utf-8"}).then((res) => {
	try {
		global.serverConfig = JSON.parse(res);
	} catch(error) {
		throw new Error("Fatal Error: Failed to load server config... " + error);
	}
});

const streamImage = (filePath, res, req) => {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if(range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        if (start >= fileSize || end >= fileSize) {
            res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
            return res.end();
        }

        const stream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Type': 'image/png',
        });

        stream.pipe(res);
    } else {
        res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': fileSize });
        fs.createReadStream(filePath).pipe(res);
    }
};
const streamAudio = (filePath, res, req) => {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        if (start >= fileSize || end >= fileSize) {
            res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
            return res.end();
        }

        const stream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Type': 'audio/mpeg',
        });

        stream.pipe(res);
    } else {
        res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': fileSize });
        fs.createReadStream(filePath).pipe(res);
    }
};
const serveFile = async (filePath, contentType, res, req) => {
    try {
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            throw new Error("Path is a directory");
        }

        if (contentType.startsWith('audio/mpeg')) {
            await streamAudio(filePath, res, req);
        } else if (contentType.startsWith('image/png')) {
            await streamImage(filePath, res, req);
        } else {
            const fileSize = stat.size;

            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Length', fileSize);
            res.setHeader('Content-Type', contentType);

            if (req.headers.range) {
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
                res.writeHead(200);
                fs.createReadStream(filePath).pipe(res);
            }
        }
    } catch (error) {
        try {
            const content = await fs.promises.readFile(`${__dirname}/Public/404.html`, 'utf-8');
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/json' });
            res.end('{"ok": false, "message": "Internal Server Error"');
        }
    }
};
const addFolderToZip = async (zipFolder, folderPath) => {
    const items = fs.readdirSync(folderPath);
    
    items.forEach(item => {
        const fullPath = path.join(folderPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            const newFolder = zipFolder.folder(item);
            addFolderToZip(newFolder, fullPath); // Recursively add subdirectories
        } else {
            const fileData = fs.readFileSync(fullPath);
            zipFolder.file(item, fileData);
        }
    });
};

// HTTP Server Setup
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Action, Content-Type, authorization');

    
    if (req.method === 'POST') {
        ServerCommunicator.handlePostRequest(req, res);
    } else if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
    } else {
	let decodedURI;
	try {
		decodedURI = decodeURIComponent(req.url);
	} catch(error) { decodedURI = "404.html"; }

        let filePath = path.join(__dirname, "Public", decodedURI);
        if (decodedURI === "/") {
            decodedURI = "/extension";
        }

        switch(new String(decodedURI).toLowerCase()) {


            case "/admin": {
                filePath += ".html";
                break;
            }

        }
		
        const extname = path.extname(filePath);
        let contentType = 'text/html; charset=utf-8';

        if(req.url.startsWith("/color@")) { 
            const username = decodedURI.replaceAll('/', '').split('@')[1];
           
            const auth = await Accounts.getAuth(username);

            if(!auth) {
                res.writeHead(500);
                res.end('null');
                return;
            }

            let text;

            if(!global.gameState.colors[auth]) {
                const config = await Accounts.getConfigByRef(username);
                if(!config) {
                    res.writeHead(500);
                    res.end('null');
                    return;
                }
                text = config.color;
                global.gameState.colors[auth] = config.color;
            } else {
                text = global.gameState.colors[auth];
            }
            
            res.writeHead(200);
            res.end(`${text}`);
            return;
        } 
        
        else if(req.url.startsWith("/ht@")) {
            const username = decodedURI.replaceAll('/', '').split('@')[1];
           
            const auth = await Accounts.getAuth(username);

            if(!auth) {
                res.writeHead(500);
                res.end('null');
                return
            }

            res.writeHead(200);
            res.end(`${global.gameState.calculateTrack(auth, false)}`);
            return;
        }

        else if(req.url.startsWith("/role@")) {
            const username = decodedURI.replaceAll('/', '').split('@')[1];
           
            const auth = await Accounts.getAuth(username);

            if(global.gameState.hiders.includes(auth)) {

                res.writeHead(200);
                res.end(`1`);
                return;
            } else if(global.gameState.seekers.includes(auth)) {

                res.writeHead(200);
                res.end(`2`);
                return;
            } else if(global.gameState.spectators.includes(auth)) {

                res.writeHead(200);
                res.end(`0`);
                return;
            } else {
                global.gameState.spectators.push(auth);

                res.writeHead(200);
                res.end(`0`);
                return;
            }
        }
        
        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.txt': contentType = 'text/plain'; break;

            case '.json': contentType = 'application/json'; break;
            case '.pdf': contentType = 'application/pdf'; break;
            case '.zip': contentType = 'application/zip'; break;

            case '.png': contentType = 'image/png'; break;
            case '.gif': contentType = 'image/gif'; break;
            case '.jpg': contentType = 'image/jpeg'; break;

            case '.wav': contentType = 'audio/wav'; break;
            case '.mp3': contentType = 'audio/mpeg'; break;

            case '.mp4': contentType = 'video/mp4'; break;

            case '.ttf': contentType = 'font/ttf'; break;
            case '.woff2': contentType = 'font/woff2'; break;
        }

        serveFile(filePath, contentType, res, req);
    }
});

// Start the server
server.listen(PORT, IP_ADDRESS, () => {
    console.clear();
    console.log(`${Color.BG_GREEN}Server is running at http://${IP_ADDRESS}:${PORT}/${Color.RESET}`);
    
    global.feet = new Feet(server, IP_ADDRESS, PORT);
    
    // askQuestion();
    
    global.gameState.update();
    setInterval(() => {
        global.gameState.update();
    }, 5000);

    setTimeout(async () => {
        while(!global.serverConfig) global.gameState.sleep(100);
        global.serverConfig.adminPassword = crypto.randomUUID();
        console.log(`To become admin, go to http://${IP_ADDRESS}:${PORT}/admin, then enter the password ${Color.RED}${global.serverConfig.adminPassword}${Color.RESET}`);
        
    }, 0.5e+3);
});
