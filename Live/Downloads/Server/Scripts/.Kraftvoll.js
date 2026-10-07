const Accounts = require('./Accounts.js');
// const global.serverFilePath = require('./global.serverFilePath.js');
const fs = require('fs').promises;
const crypto = require('crypto');


const MAX_CHUNK_SIZE = 9e+3;
const MAX_CHAR = 2e+3;

const MESSAGES_SENT = {};
const TIMEOUTS_FOR_MESSAGES = {};
const SUS_RATE = 30;
const TIMEOUTS_FOR_REDEMPTION = {};

class Kraftvoll {
	// X-Action: Kraftvoll_CreateChannel
    static async createChannel(participants = []) {

        if(!Array.isArray(participants)) {
            return {
                "ok": false,
                "message": "Error: participants is not an array"
            };
        }

        if(participants.length < 2) {
            return {
                "ok": false,
                "message": "Not enough members!"
            };
        }

        if(duplicateItems(participants)) {
            return {
                "ok": false,
                "message": "Duplicate users"
            };
        }

        // Ensure all players existed
        let usernames = null;
        {
            let promises = [];
            for(let i = 0; i < participants.length; i++) {
                promises.push(Accounts.getUsername(participants[i]));

                const sender = participants[i];

                // Check for rate limiting
                if(!isNaN(MESSAGES_SENT[sender]) && MESSAGES_SENT[sender] >= SUS_RATE) {
                    clearTimeout(TIMEOUTS_FOR_MESSAGES[sender]);

                    if(!TIMEOUTS_FOR_REDEMPTION[sender]) {
                        TIMEOUTS_FOR_REDEMPTION[sender] = setTimeout(() => {
                            delete TIMEOUTS_FOR_REDEMPTION[sender];
                            MESSAGES_SENT[sender] = 0;
                        }, 180e+3); // 3 minutes
                    }
                    return {
                        "ok": false,
                        "message": "One or more users are rate limited!"
                    };
                }
            }
            
            usernames = await Promise.all(promises);

            for(let i = 0; i < usernames.length; i++) {
                if(!usernames[i]) {
                    return {
                        "ok": false,
                        "message": "One or more users don't exist!"
                    };
                }
            }
        }
        
        // Ensure this Channel doesn't already exist
        const globalChannelManifest = await Kraftvoll.loadGlobalChannelsManifest();
        {
            let success = true;
            for(let i = 0; i < globalChannelManifest.length; i++) {
                if(areArraysEqual(globalChannelManifest[i], participants)) {
                    success = false;
                    break;
                }
            }
    
            if(!success) {
                return {
                    "ok": false,
                    "message": "This already exists!"
                };
            }

            globalChannelManifest.push(participants);
        }

        const manifest = {};
        manifest.participants = participants;
        manifest.usernames = usernames;

        manifest.id = Kraftvoll.generateAnId(participants.join('-') + crypto.randomUUID().substring(0, 5));

        try {
            await fs.mkdir(`${global.serverFilePath}/Data/Kraftvoll/Channels/${manifest.id}`);
            await fs.writeFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/${manifest.id}/manifest.json`, JSON.stringify(manifest));
            await fs.writeFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/${manifest.id}/Log.ndjson`, "");

            await fs.appendFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/List.txt`, `\n${manifest.id}`);
            await fs.writeFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/manifest.json`, JSON.stringify(globalChannelManifest));
            
            const list = JSON.parse(await fs.readFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/manifest.json`, {"encoding": "utf-8"}));
            list.push(JSON.parse(JSON.stringify(participants)));
        } catch (error) {
            console.error("Failed to write new Channel info!" + error);

            return {
                "ok": false,
                "message": error
            };
        }

        // Add Channel IDs to accounts
        for(let i = 0; i < participants.length; i++) {
            try {
                Accounts.getConfigByRef(participants[i]).then(async (config) => {
                    if(!config || !config.authorization) {
                        throw new Error("Failed to load user config!");
                    }
                    
                    if(!config.kraftvollChannels || !Array.isArray(config.kraftvollChannels)) config.kraftvollChannels = [];
    
                    let usernamesPromises = [];
                    for(let i = 0; i < participants.length; i++) {
                        usernamesPromises.push(Accounts.getUsername(participants[i]));
                    }

                    const usernames = await Promise.all(usernamesPromises);

                    config.kraftvollChannels.push([manifest.id, usernames]);                    

                    Accounts.saveConfigByRef(participants[i], JSON.parse(JSON.stringify(config)));
                }).catch((error) => {
                    console.warn(error);
                });

            } catch (error) {
                console.warn(error);
            }
        }

        // Add to GameState
        if(!global.gameState.kraftvollChannels || !Array.isArray(global.gameState.kraftvollChannels)) global.gameState.kraftvollChannels = [];
        global.gameState.kraftvollChannels.push(manifest.id); 

        return {
            "ok": true,
            "data": manifest.id
        };
    }

	// X-Action: Kraftvoll_Send
    static async sendMessage(channel, sender, textContent = "") {

        // Check for rate limiting
        if(!isNaN(MESSAGES_SENT[sender]) && MESSAGES_SENT[sender] >= SUS_RATE) {
            clearTimeout(TIMEOUTS_FOR_MESSAGES[sender]);

            if(!TIMEOUTS_FOR_REDEMPTION[sender]) {
                TIMEOUTS_FOR_REDEMPTION[sender] = setTimeout(() => {
                    delete TIMEOUTS_FOR_REDEMPTION[sender];
                    MESSAGES_SENT[sender] = 0;
                }, 180e+3); // 3 minutes
            }
            return {
                "ok": false,
                "message": "You've been rate limited! Please wait before doing other things!"
            };
        }

		if(!textContent || textContent == "" || toString(new String(textContent)).trim() == "") {
			return {
				"ok": false,
				"message": "No included message!"
			};
		}
		
        const username = await Accounts.getUsername(sender);

        if(!username) {
            return {
                "ok": false,
                "message": "You don't exist"
            };
        }
        
        let manifest = null;
        
        try {
            manifest = JSON.parse(await fs.readFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/${channel}/manifest.json`));
        } catch (error) {
            return {
                "ok": false,
                "message": "This channel doesn't exist"
            };
        } 

        if(textContent === "throw error here") {
            return {
                "ok": false,
                "message": "I threw that error for you :)"
            };
        }

        // Sanitize 
		try {
			textContent = textContent
	                                .replace(/\r/g, '')      // Remove carriage returns
	                                // .replace(/\n/g, '\\n')   // Escape newlines
	                                .replace(/\t/g, '\\t')   // Escape tabs
	                                .replace(/"/g, '\\"')    // Escape quotes
	                                .trim(); // Trim
		} catch (error) {
			console.error(error);
			return {
				"ok": false,
				"message": "Internal "
			};
		}
        

		if(textContent.length > MAX_CHAR) {
			textContent = textContent.substring(0, MAX_CHAR);
		}
								
        // Save to files
        try {
            const motion = {};

            motion.sender = username;
            // motion.senderPrivateId = sender;
            motion.text = textContent;
            motion.time = getCurrentTime();
            
            const filepath = `${global.serverFilePath}/Data/Kraftvoll/Channels/${channel}/Log.ndjson`;

            const log = await fs.readFile(filepath, {"encoding": "utf-8"});
            await fs.writeFile(filepath, `${JSON.stringify(motion)}\n${log}`);
            
        } catch (error) {
            return {
                "ok": false,
                "message": "Internal Server Error"
            };
        }

        // Alert other channel members via feet
        for(let i = 0; i < manifest.participants.length; i++) {
            const user = manifest.participants[i];
            if(user === sender) continue;

            global.feet.uuid.sendMessage(user, {
                "X-Action": "Kraftvoll-newMessage",
                "data": {
                    "sender": username,
                    "message": textContent
                },

            })
        }

        if(!MESSAGES_SENT[sender]) MESSAGES_SENT[sender] = 0;
        MESSAGES_SENT[sender]++;
        
        clearTimeout(TIMEOUTS_FOR_MESSAGES[sender]);

        TIMEOUTS_FOR_MESSAGES[sender] = setTimeout(() => {
            MESSAGES_SENT[sender] = 0;
            TIMEOUTS_FOR_MESSAGES[sender] = null;
        }, 45e+3);

        return {
            "ok": true,
        };
    }

	// X-Action: Kraftvoll_Load
    static async loadMessages(channel, user, index = 1) {
        // Check for rate limiting
        if(!isNaN(MESSAGES_SENT[user]) && MESSAGES_SENT[user] >= SUS_RATE) {
            clearTimeout(TIMEOUTS_FOR_MESSAGES[user]);

            if(!TIMEOUTS_FOR_REDEMPTION[user]) {
                TIMEOUTS_FOR_REDEMPTION[user] = setTimeout(() => {
                    delete TIMEOUTS_FOR_REDEMPTION[user];
                    MESSAGES_SENT[user] = 0;
                }, 180e+3); // 3 minutes
            }
            return {
                "ok": false,
                "message": "You've been rate limited! Please wait before doing other things!"
            };
        }

        const username = await Accounts.getUsername(user);

        if(!username) {
            return {
                "ok": false,
                "message": "You don't exist"
            };
        }

        if(index < 1) {
            return {
                "ok": false,
                "message": "Index is out of range (" + index + ")"
            };
        }

        let manifest = null;
        
        try {
            manifest = JSON.parse(await fs.readFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/${channel}/manifest.json`));
        } catch (error) {
            return {
                "ok": false,
                "message": "This channel doesn't exist"
            };
        }

        if(!manifest.participants.includes(user)) {
            return {
                "ok": false,
                "message": "This channel doesn't exist" // The only good security in GCHNS: vague errors
            };
        }

        const history = [];

        try {
            const file = (await fs.readFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/${channel}/Log.ndjson`, {"encoding": "utf-8"})).split('\n');

            let highRange = MAX_CHUNK_SIZE * index;
            let lowRange = (MAX_CHUNK_SIZE * (index - 1)) + 1;
            if(index === 1) lowRange--;

            let failure = 0;

            for(let i = lowRange; i < highRange; i++) {
    
                if(!file[i]) {
                    failure++;

                    if(failure >= 5) {
                        break;
                    }

                    continue;
                }

                try {
                    history.push(JSON.parse(file[i]));
                } catch (error) {
                    console.error(error);
                }
            }

            return {
                "ok": true,
                "data": JSON.parse(JSON.stringify(history)),
                "highRange": highRange,
                "lowRange": lowRange,
            };
        
        } catch (error) {
            return {
                "ok": false,
                "message": error
            };
        }
    }

    // X-Action: NOT_IMPLEMENTED AS POST COMMAND YET (TODO:)
    static async getYourChannels(user) {
        const config = await Accounts.getConfigByRef(user);

        if(!config) {
            return {
                "ok": false,
                "message": "You don't exist"
            };
        }

        return {
            "ok": true,
            "data": config.kraftvollChannels
        }
    }

    // Load the global channels manifest
    /*
        [
            ["playerId", "playerId"],
            ["playerId", "playerId"]
        ]
    */
    static async loadGlobalChannelsManifest() {
        try {
            return JSON.parse(await fs.readFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/manifest.json`, {"encoding": "utf-8"}));
        } catch (error) {
            console.error("Failed to load global channel list: " + error + "\nThis error is most likely caused by Manifest.json being empty, instead of \"[]\"");
            return undefined;
        }
    }

    // Load the list of Channel IDs
    static async loadChannelsList() {
        try {
            return (await fs.readFile(`${global.serverFilePath}/Data/Kraftvoll/Channels/List.txt`, {"encoding": "utf-8"})).split('\n').filter(line => line.trim());
        } catch (error) {
            console.error("Failed to load channel list: " + error);
            return undefined;
        }
    }

    // Generate an ID
    static generateAnId(uniqueString) {
        return crypto.createHash('sha256').update(uniqueString).digest('hex');
    }
}

module.exports = Kraftvoll;

// Kraftvoll.init();
function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    let freqMap = new Map();

    for (let item of arr1) {
        freqMap.set(item, (freqMap.get(item) || 0) + 1);
    }

    for (let item of arr2) {
        if (!freqMap.has(item) || freqMap.get(item) === 0) return false;
        freqMap.set(item, freqMap.get(item) - 1);
    }

    return true;
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hours}:${minutes} ${ampm}`;
}

function duplicateItems(victims) {
    const seen = new Set();
    for (const victim of victims) {
        if (seen.has(victim)) {
            return true; // Duplicate found
        }
        seen.add(victim);
    }

    return false; // No duplicates
}