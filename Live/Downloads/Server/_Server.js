const path = require("path")

class _Server {
    constructor(port, ip) {
        this.port = port;
        this.ip = ip;
    }

    generateSecret() {
        const size = 12;

        let secret = [];

        for (let i = 0; i < size; i++) {
            // const proposed = String.fromCharCode(
            //     Math.floor(Math.random() * (126 - 32 + 1)) + 32
            // );
            const proposed = Math.floor(Math.random() * 10);
            secret.push(proposed);
        }

        const key1 = parseInt(secret[0]) + parseInt(secret[4]);
        if(key1 >= 10) {
            const sKey = `${key1}`;
            secret[10] = sKey.at(0);
            secret[11] = sKey.at(1);
        } else {
            secret[11] = key1;
        }

        const key2 = parseInt(secret[3]) + parseInt(secret[7]);
        if(key2 >= 10) {
            const sKey = `${key2}`;
            secret[8] = sKey.at(0);
            secret[9] = sKey.at(1);
        } else {
            secret[8] = key2;
        }

        return secret.join('');
    }

    getContentType(filePath) {

        const extname = path.extname(filePath);
        let contentType = 'text/html; charset=utf-8';
        
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.txt':
                contentType = 'text/plain';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.jpg':
                contentType = 'image/jpeg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
            case '.mp3':
                contentType = 'audio/mpeg';
                break;
            case '.pdf':
                contentType = 'application/pdf';
                break;
            case '.mp4':
                contentType = 'video/mp4';
                break;
            case '.ttf':
                contentType = 'font/ttf';
                break;
            case '.woff2':
                contentType = 'font/woff2';
            break;
                        
        }

        return contentType;
    }
};

module.exports = _Server;