const fs = require('fs').promises;
const path = require('path');

// const rescaleImage = require('./RescaleImage.js');
// const global.serverFilePath = require('./global.serverFilePath.js');

global.usernameAuthCache = {

};

const writeQueue = new Map();

class Accounts {
    static getRandomNumber(min, max) {
        try {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } catch (e) {
            return -1;
        }
    }

    /* Creates account

    Expects this as its input: 
    {
            "username": "Tyñeesha Kobeesha",
            "password": "qwerty",
            "fullName": "Tyler Koberna",

    }
    */
    async createAccount(data) {

        if(new String(data.username).length < 1 || new String(data.password).length < 1) {
            return {
                "ok": false,
                "message": "Not enough information"
            };
        }

        data.username = data.username.trim(); // Trim the username
        
        // Check username requirements
        {
            const requirements = this.usernameStandards(data.username);
            
            if(requirements !== true) {
                return {
                    "ok": false,
                    "message": requirements
                };
            }
        }

        
        // Create auth keys
        const AUTH_KEY = crypto.randomUUID();

        // Write account data config
        let accountData = {
            "authorization": AUTH_KEY,
            "username": data.username,
            "admin": false,
            "color": (data.color !== "#000000") ? data.color : `rgb(${global.gameState.getRandomNumber(1, 255)}, ${global.gameState.getRandomNumber(1, 255)}, ${global.gameState.getRandomNumber(1, 255)})`,
            "email": data.email
        };

        // Save to Server
        {
            // Save to main user config file
            {
                global.gameState.accounts[AUTH_KEY] = accountData;
            }

            // Save to usernames list
            {
                const username = accountData.username.toLowerCase();
                global.gameState.usernamesList.push(username);
            }

            // Save to auth ids list
            {
                const auth = accountData.authorization;
                global.gameState.authList.push(auth);
            }
        }

        // Log new account info to the console
        console.log(`🎊 - ${data.fullName} (@${data.username}) created an account!`);
        console.log(accountData);

        // Save color to gameState
        global.gameState.colors[data.authorization] = data.color;

        // Send the stuff to the client 
        return {
            "ok": true,
            "message": null,
            "authorization": AUTH_KEY,
        };
    }

    usernameStandards(username) {
        let reasoning = "";
        let passes = true; // true means that it passes


        // Preform tests
        {
            if(username.length < 1) {
                return "Usernames are mandatory!"; // all of the other tests will be fail. just return it.
            }

            // Check if it's more than 30 characters
            if(username.length > 30) {
                passes = false;
                reasoning += "Usernames cannot be above 30 characters. ";
            }

            // Check if it contains swears (note: if this becomes a problem, just use some pre-existing validation algorithm)
            const t = username.toLowerCase();
            if(t.includes('fuck') 
                || t.includes('shit')
                || t.includes('damn')
                || t.includes('nigger')
                || t.includes('nigga')
                || t.includes('faggot')
                || t.includes('asshole')
                || t.includes('bastard')
            ) {
                passes = false;
                reasoning += "Your username contains a banned word. ";
            }
            
            // Check for reserved / banned usernames / username inclusions
            if(t.includes('pfp') || t.includes('sudo') || t.includes('\n')) {
                passes = false;
                reasoning += "Your username contains a reserved word, name, or phrase.";
            }

        }
        
        // If all tests passed
        if(passes) {
            return true;
        }

        // If one or more tests failed
        return reasoning;
    }

}

module.exports = Accounts;