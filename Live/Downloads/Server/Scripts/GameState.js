const fs = require('fs').promises;
// const global.serverFilePath = require('./global.serverFilePath.js');
const Accounts = require('./Accounts.js');
const Color = require('./Color.js');
const events = require('events');

class GameState {
    constructor() {
        this.host = null; // <ip-address>:<port>

        this.gameActive = true;

        this.memo = "CoreNote Live";
        
        this.allPlayers = [];
		this.allUsernames = [];
        this.onlinePlayers = [];

        this.accounts = {};
        this.usernamesList = []
        this.authList = []

	
        this.colors = {

        };

        this.customThemes = [];
        this.customThemeRatingLimiting = [];

        this.iteration = 0;

        this.exceptions = {
            "showAllPlayersCursorsRegardlessOfWebPage": undefined
        };

        this.themePath = `${__dirname.replace('Scripts', "")}Themes.txt`;
    }
	
	// s
	

    async update() {
        
    }

    async pushAllUsers() {
        
    }

   
 
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
	
	sleep(ms) {
		return new Promise(resolve => { setTimeout(resolve, ms)});
	}

    test() {

    }
}

module.exports = GameState;