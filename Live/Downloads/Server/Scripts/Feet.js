const fs = require('fs').promises;
const WebSocket = require("ws"); 
const Color = require('./Color.js')
const Accounts = require('./Accounts.js');
const events = require('events');
// const global.serverFilePath = require('./global.serverFilePath.js');

const LOG_WEBSOCKET_CONNECTIONS = false;

const MESSAGES = {
    "unsigned": "Unsigned request. (I.E: data.auth and data.auth_file was undefined or not true!). You're probably not signed in.",
    "offline": "The Manhunt IRL WebSockets are currently disabled.",
    "json": "Invalid JSON data: ",
    "duplicateWindows": "The provided user ID is already connected to socks. Are you logged in twice?"
};


// Will run with every reconnect
const preservation = {
};

// If you send a message to a client that isn't online, X-Waited beign true will stick it in here for it to send upon connection
const wait = {
};

// Sends a message to a client
/*
    Example:
        "X-Action": "location",
        "X-Preserve": "whether the request will be remembered (so if the client disconnects, it can resend it)"
        "X-Waited": "This being true will ensure this is ran whenever the socket is connected (assuming this ran while it was disconnected)"
        "X-ResponseID": "v4 UUID without dashes", // added by function
        "X-CurrentTime": "current time", // added by function
        "X-Formatted": "boolean on whether its xAction based" // added by function
*/
const sendMessage = async function(message) {

    // You can, to some extent, control/manage the socket by sending requests
    switch(message) {
        case "#clearPreserve": {
            preservation[this.authorization] = [];
            return;
        }
    }
    
    return new Promise((resolve, reject) => {
        const ResponseID = crypto.randomUUID().replaceAll('-', '');
        resolve(ResponseID);
        
        // Updates message history
        const updateHistory = (myMessage) => {
            myMessage = [fancyCurrentTime(), "server", myMessage];
            this.history.push(myMessage);
        };
        
        const isJson = typeof message === 'object' &&
        message !== null &&
        !Array.isArray(message);
        
        if(isJson) {
            // This can be used over the X-Actuon for ID
            if(!message["X-ResponseID"]) message["X-ResponseID"] = ResponseID;
            
            message["X-CurrentTime"] = getCurrentTime(true);
            // console.log(`${Color.BG_RED}KILL THOSE BASTARDS!${Color.RESET}`);

            message["X-Now"] = performance.now();
            
            if(!message["X-Action"]) {
                message["X-Formatted"] = false;
            } else {
                message["X-Formatted"] = true;
            }

            // Preserve request!
            if(message["X-Preserve"] === true) {

                if(!preservation[this.authorization]) preservation[this.authorization] = [];

                preservation[this.authorization].push(message);
            }

            message = JSON.stringify(message);
        } else {
            message = {
                "data": message,
                "X-Formatted": false
            };
            
            message = JSON.stringify(message);
        }

        try {
            
            this.sock.send(message);

            if(global.feet) {
                global.feet.history["s" + ResponseID] = message;
            }
            
            updateHistory(message);
        } catch (error) {
            const errorMessage = `Failed to send message ${message} to ${this.authorization}. Error: ${error}`;
            this.close(1006, "Failed to send message");
            console.error(errorMessage);
            
        }
    }); 
};

const messageReceiver = async function(id, forceWait = false) {
    if (typeof id === "boolean") {
        console.error(`⚠️ ID DEFINED AS FORCEWAIT. BAD! USER ID: ${this.authorization}`);
        id = false;
        forceWait = true;
    }

    // Updates message history
    const updateHistory = (message) => {
        message = [fancyCurrentTime(), "client", message];
        this.history.push(message);
    };

    // Clear all previous listeners
    // this.sock.removeAllListeners('message');

    let timeout = null;

    return new Promise((resolve) => {
        let removeOnFailure = false;
        let failedAttempts = 0;

        const onMessage = (message) => {
            try {
                let parsedMessage = message.toString();

                if (isJSON(parsedMessage)) {
                    parsedMessage = JSON.parse(parsedMessage); // Fixed typo

                    const xAction = parsedMessage["X-Action"];
                    const responseID = parsedMessage["X-ResponseID"];

                    removeOnFailure = false;

                    if (id && id !== responseID) {
                        // console.warn(`Response ID mismatch. Ignoring message. ${xAction} (response) !== ${id} (request)... ` + JSON.stringify(parsedMessage));
                        // resolve();
                        return;
                    }
                    else if (id && id.length !== 32 && id !== xAction) {
                        // console.warn(`Action mismatch. Ignoring message. ${xAction} (response) !== ${id} (request)... ` + JSON.stringify(parsedMessage));
                        // resolve();
                        return;
                    }

                    global.feet.history["c" + responseID] = JSON.stringify(parsedMessage);
                }

                // Successful message processing
                updateHistory(parsedMessage);
                resolve(parsedMessage);

                // Clear the timeout when we successfully process the message
                if (timeout) clearTimeout(timeout);
                this.sock.off('message', onMessage);
            } catch (err) {
                console.error("Error processing message:", err);
                resolve(null); // Fail gracefully

                // Clear the timeout in case of error
                if (timeout) clearTimeout(timeout);
                try {
                    this.sock.off('message', onMessage);
                } catch (error) {}
            }
        };

        if (!forceWait) {
            const self = this;
            timeout = setTimeout(function runTimeout() {
                failedAttempts++;

                resolve(null); // Fail gracefully

                if (removeOnFailure || failedAttempts >= 5) {
                    try {
                        self.sock.off('message', onMessage);
                        self.close(4000, "Unexpected Disconnect. (Response ID: " + id + ")");
                    } catch (error) {
                        // Handle any cleanup if needed
                    }
                } else {
                    timeout = setTimeout(runTimeout, self.timeout || 10000);
                }
            }, self.timeout || 10000); 
        }

        // Attach listener for message
        this.sock.on('message', onMessage);
    });
};


const getLatestMessage = async function() {
    return this.history[this.history.length - 1];
};

const disconnectEvent = function(data) {
    try {

        
        Accounts.getUsername(data.authorization).then((username) => {
            if(LOG_WEBSOCKET_CONNECTIONS) console.log(`${Color.DARK_GRAY}🛫 - ${data.authorization} ("${username}") disconnected from the websocket!${Color.RESET}`);
            
            // Tell all players
            global.feet.socks.forEach(sock => {
                sock.sendMessage({
                    "X-Action": "playerLeave",
                    "player": username
                });
            });
        });

        // Reference the global.feet.socks array
        const index = global.feet.uuid.uuidToIndex(data.authorization); // HACK
    
        if (index !== -1) {
            global.feet.socks.splice(index, 1); // Remove the sock from the array // HACK:
            
        } else {
            // console.error("Could not find this sock in global.feet.socks");
        }

        // Remove from online players list
        for(let i = 0; i < global.gameState.onlinePlayers.length; i++) {
            if(global.gameState.onlinePlayers[i] === data.authorization) {
                global.gameState.onlinePlayers.splice(i, 1);
            } 
        }

    } catch (error) {
        console.error(error);
    }
};

const close = async function(code, message) {
    try {
        const isJson = typeof message === 'object' && message !== null && !Array.isArray(message);

        if(isJson) {
            message = JSON.stringify(message);
        }

        // this.sock.removeAllListeners();

        this.sock.close(code, message);


        // Reference the global.feet.socks array
        // const index = global.feet.socks.indexOf(this);

        // if(LOG_WEBSOCKET_CONNECTIONS) {
        //     console.log(`${Color.DARK_GRAY}🛫 - ${this.authorization} (IP: ${this.ip}) disconnected from the websocket!${Color.RESET}`);
        // }

        // if (index !== -1) {
        //     global.feet.socks.splice(index, 1); // Remove the sock from the array
        // } else {
        //     // console.error("Could not find this sock in global.feet.socks");
        // }
    } catch (error) {
        console.warn(error);    
    }
};

class Feet {   
    WebSocket = null;
    socks = [];
    history = {};

    // Starts listening to requests. As well as passing off access to socks.
    constructor(server, IP_ADDRESS, PORT) {
        // Set const properties
        Object.defineProperty(this, 'MAX_UNSIGNED_REQUESTS', {
            value: 1,
            writable: false,
            configurable: false
        });

         // Start WebSocket server
         this.WebSocket = new WebSocket.Server({ server: server }); // create the websocket
        console.log(`${Color.BG_GREEN}WebSocket Server is running at ws://${IP_ADDRESS}:${PORT}/${Color.RESET}`);
        
        // Start a clearing thing
        {
            setInterval(() => {
                for(let i = this.socks.length - 1; i >= 0; i--) {
                    if(this.socks[i].sock.readyState === 3) {
                        this.socks.splice(i, 1);
                    }
                }
            }, 5000);
        }

        // Start Listening
        this.WebSocket.on('connection', (ws) => {

            // Variables
            let unsignedRequests = 0; // the amount of requests that are sent here, in the constructor. since any signed connections forego the constructor.

            // Close if it's disabled
            if(this.MAX_UNSIGNED_REQUESTS === 0) {
                ws.close(1006, MESSAGES.offline);
                return;
            }

            // Close if the amount of unsigned requests is greater than the max safe amount (defined  into 'this' earlier in the constructor)
            if(unsignedRequests > this.MAX_UNSIGNED_REQUESTS && this.MAX_UNSIGNED_REQUESTS !== -1) {
                ws.close(1008, MESSAGES.unsigned);
                return;
            }

            ws.on('message', async (message) => {
                try {   
                    unsignedRequests++;

                    let data = null;
                    try {
                        data = JSON.parse(message);
                    } catch (error) {
                        if(LOG_WEBSOCKET_CONNECTIONS) {
                            console.log(error);
                            console.warn("Unverified WS request!");
                        }

                        if(this.MAX_UNSIGNED_REQUESTS === 1) {
                            if(verified === false) {
                                ws.close(1008, MESSAGES.unsigned);
                            
                            // Display custom message
                            } else {
                                ws.close(1008, verified)
                            }
                        }
                    }

                    const verified = await this.verifier(data);

                    // Check if this is a proper verification thing
                    if(verified === true) {
                        // Log the new connection to the console

                        if(LOG_WEBSOCKET_CONNECTIONS) {
                            console.log(`${Color.DARK_GRAY}🎊 - ${data.authorization} ("${await Accounts.getUsername(data.authorization)}") connected to the websocket!${Color.RESET}`);
                        }

                        // Remove all old listeners 
                        ws.removeAllListeners();
                        
                        ws.on('close', () => {
                            disconnectEvent(data);
                        });

                        // Create the sock object (to put in the feet.socks)
                        const OBJECT  = {
                            "authorization": data.authorization,
                            "info" : data,
                            "history": [], // message history
                            "sock": ws, 
                            "timeout": 15000,

                            // Send JSON data
                            "sendMessage": sendMessage,

                            // Get latest message
                            "getLatestMessage": getLatestMessage,

                           "messageReceiver": messageReceiver,

                           "close": close,
                        };

                        const index = this.socks.length;

                        // Add set object to the thing
                        this.socks.push(OBJECT);

                        // wait
                        if (wait[OBJECT.authorization] instanceof require('events').EventEmitter) {
                            wait[OBJECT.authorization].emit('connection');
                        }
						
						try {
						// this.socks[index].sendMessage("#clearPreserve");
						} catch (error) {
							
						}

                        if(Array.isArray(preservation[OBJECT.authorization])) {
                            // console.log("WE'RE IN THE IF STATEMENT!")
                            for(let i = 0; i < preservation[OBJECT.authorization].length; i++) {
                                // console.log("WE'RE IN THE FOR STATEMENT!")
                                let timespan = 3e+3;
                                if(preservation[OBJECT.authorization].length <= 10)  timespan = 1e+3;
                                
                                setTimeout(() => {
                                    // console.log(preservation[OBJECT.authorization][i])
                                    preservation[OBJECT.authorization][i]["X-Preserve"] = false;

                                    try {
                                        this.socks[index].sendMessage(preservation[OBJECT.authorization][i]);
                                    } catch (error) {
                                        
                                    }
                                }, timespan * i); // Don't go spamming the client
                            } 
                        }

                    } else {
                        if(LOG_WEBSOCKET_CONNECTIONS) {
                            console.log("Fail point 2" + OBJECT)
                            console.warn("Unverified WS request!");
                        }

                        if(this.MAX_UNSIGNED_REQUESTS === 1) {
                            if(verified === false) {
                                ws.close(1008, MESSAGES.unsigned);
                            
                            // Display custom message
                            } else {
                                ws.close(1008, verified)
                            }
                        }
                    }
                } catch (error) {
                    ws.close(1003, `${MESSAGES.json + message}`);
                    return;
                }
            });         
        });
    }

    /* Backs up "this"
        What logical reason does backing this up serve? I don't really know, but we're doing it nonetheless.
    */
    // async backup() {
    //     try {
    //         const currentTime = getCurrentTime();
    //         console.log(`${Color.YELLOW}Backed up \"Feet\"🦶 at ${currentTime}.${Color.RESET}`);
    //         await fs.writeFile(`${global.serverFilePath}/server/game/feet/${currentTime}.json`, JSON.stringify(this));
    //     } catch (error) {
    //         console.error("❌ - Failed to backup Feet!: " + error);
    //     }
    // }

    /* Checks an "interview" (what the server should be sent first).
        Returns true if it's valid
        Rules: 
            • Must include an auth id {authorization}
                - aka, a uuid
                - Must be validated
    */
    async verifier(data) {    

        // Check for auth id 
        {
            if(!data?.authorization) {
                return false;
            }
    
            // Check if the auth id is valid
            {
                try {
                    // Read the file
                    const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Auth IDs.txt`);
                        
                    // Check if it DOESN'T include the provided id
                    if(!response.includes(data.authorization)) {
                        return false;
                    }
    
                } catch (error) {
                    console.error("Failed to fetch the user ids list!");
                    console.warn(error);
                    return false;
                }
    
            }
        }

        // Make sure they don't already exist
        {
            // Update and read the GameState
            await global.gameState.update();
            
            // Save the onlinePlayers to a locally scoped variable
            const onliners = global.gameState.onlinePlayers;

            // Check to see if your UUID is on that list
            if(onliners.includes(data.authorization)) {
                return MESSAGES.duplicateWindows;
                
                // Just kick that other player offline
                // this.uuid.close(data.authorization, 1008, "Another user logged in with this ID")
            }
        }

        // All tests passed, yay!
        return true;
    }

    // START: Actual commands

    // This is for managing socks via a uuid (b517f76a-e94e-48de-b64c-3e93eb4dc407)
    uuid = {
        /* Send a message to the client
            By code, this should be a JSON object. In fact, it pretty much has to since it will be parsed when received no matter what.
        */
        sendMessage: async (uuid, message) => {
            let index = this.uuid.uuidToIndex(uuid);

            // If this is X-Waited
            if(index === -1 && typeof message === 'object' && message["X-Waited"] === true && uuid && uuid?.length === 36) {
                if(!wait[uuid]) wait[uuid] = new events.EventEmitter();
                wait[uuid].setMaxListeners(50);
                
                await new Promise((resolve) => {
                    wait[uuid].once("connection", () => {
                        resolve(true);
                        delete wait[uuid];
                    });
                });
                
                index = this.uuid.uuidToIndex(uuid);
            }

            if(index === -1 && message === "#clearPreserve") {
                try {
                    delete preservation[uuid];
                } catch (error) {

                }
                return false;
            }

            // If it isn't
            if(index === -1) {
                return false;
            }

            return await this.socks[index].sendMessage(message);
        },

        /* Gets the last received message from the server
            I don't know what this will be useful for, but it is here.
            This can only get tracked messages. AKA, if the messageReceiver wasn't listening, this won't work.
        */
        getLatestMessage: (uuid) => {
            const index = this.uuid.uuidToIndex(uuid);
            
            if(index === -1) {
                return false;
            }

            return this.socks[index].getLatestMessage();
        },

        /*  Will return a promise (containing a message) once one is received

        */
        messageReceiver: async (uuid, id = undefined, forceWait = false) => {
            const index = this.uuid.uuidToIndex(uuid);

            if(index === -1) {
                return false;
            }

            return await this.socks[index].messageReceiver(id, forceWait);
        },

        /* Closes the current connection
            1000 - Normal Closure: The connection successfully completed its purpose.
            1001 - Going Away: The server or client is going away, such as a server shutdown or browser navigation.
            1002 - Protocol Error: The connection is terminated due to a protocol error.
            1003 - Unsupported Data: The connection is closed because of receiving an unsupported data type.
            1005 - No Status Received: Reserved code indicating that no status code was provided.
            1006 - Abnormal Closure: Reserved code indicating the connection was closed abnormally without a close frame.
            1007 - Invalid Payload Data: The connection is terminated due to invalid or inconsistent data in the message payload.
            1008 - Policy Violation: The connection is closed because a policy was violated.
            1009 - Message Too Big: The connection is terminated because a message exceeded allowed size.
            1010 - Mandatory Extension: The client is closing the connection because the server did not negotiate one or more extensions required by the client.
            1011 - Internal Server Error: The connection is terminated due to an unexpected server error.
            1012 - Service Restart: The server is restarting and the client should reconnect.
            1013 - Try Again Later: The server is temporarily unavailable due to overload or maintenance.
            1014 - Bad Gateway: Reserved for future use related to proxy and gateway issues.
            1015 - TLS Handshake Failure: Reserved code indicating a failure in the TLS handshake.
        */
        close: (uuid, code, message) => {
            const index = this.uuid.uuidToIndex(uuid);

            if(index === -1) {
                return false;
            }

            this.socks[index].close(code, message);
        },

        /* Helper method to convert a uuid to an index of the socks array

        */
        uuidToIndex: (uuid) => {
            for(let i = 0; i < this.socks.length; i++) {
                if(this.socks[i].authorization === uuid) {
                    return i;
                }
            }

            // That UUID isn't a thing
            return -1;
        }
    }
	 
	// Sockets via username (default: ej1llo)
	 // Only use if you're required to, since usernames are VERY publicly accessible.
	 // All of these are async. However, the only that really needs to be awaited is, of course, the message receiver
	username = {
        /* Send a message to the client
            By code, this should be a JSON object. In fact, it pretty much has to since it will be parsed when received no matter what.
        */
        sendMessage: async (username = "ej1llo", message) => {
            const index = await this.username.usernameToIndex(username);

            // If this is X-Waited
            if(index === -1 && typeof message === 'object' && message["X-Waited"] === true && username) {
                // console.log("YAY!")
                if(!wait[username]) wait[username] = new events.EventEmitter();
                wait[username].setMaxListeners(50);
            
                await new Promise((resolve) => {
                    wait[username].once("connection", resolve);
                });
                
                index = this.username.usernameToIndex(username);
            }

            if(index === -1) {
                return false;
            }

            return await this.socks[index].sendMessage(message);
        },

        /* Gets the last received message from the server
            I don't know what this will be useful for, but it is here.
            This can only get tracked messages. AKA, if the messageReceiver wasn't listening, this won't work.
        */
        getLatestMessage: async (username = "ej1llo") => {
            const index = await this.username.usernameToIndex(username);
            
            if(index === -1) {
                return false;
            }

            return this.socks[index].getLatestMessage();
        },

        /*  Will return a promise (containing a message) once one is received

        */
        messageReceiver: async (username = "ej1llo", id = undefined, forceWait = false) => {
            const index = await this.username.usernameToIndex(username);

            if(index === -1) {
                return false;
            }

            return await this.socks[index].messageReceiver(id, forceWait);
        },

        /* Closes the current connection
            1000 - Normal Closure: The connection successfully completed its purpose.
            1001 - Going Away: The server or client is going away, such as a server shutdown or browser navigation.
            1002 - Protocol Error: The connection is terminated due to a protocol error.
            1003 - Unsupported Data: The connection is closed because of receiving an unsupported data type.
            1005 - No Status Received: Reserved code indicating that no status code was provided.
            1006 - Abnormal Closure: Reserved code indicating the connection was closed abnormally without a close frame.
            1007 - Invalid Payload Data: The connection is terminated due to invalid or inconsistent data in the message payload.
            1008 - Policy Violation: The connection is closed because a policy was violated.
            1009 - Message Too Big: The connection is terminated because a message exceeded allowed size.
            1010 - Mandatory Extension: The client is closing the connection because the server did not negotiate one or more extensions required by the client.
            1011 - Internal Server Error: The connection is terminated due to an unexpected server error.
            1012 - Service Restart: The server is restarting and the client should reconnect.
            1013 - Try Again Later: The server is temporarily unavailable due to overload or maintenance.
            1014 - Bad Gateway: Reserved for future use related to proxy and gateway issues.
            1015 - TLS Handshake Failure: Reserved code indicating a failure in the TLS handshake.
        */
        close: async (username = "ej1llo", code, message) => {
            const index = await this.username.usernameToIndex(username);

            if(index === -1) {
                return false;
            }

            this.socks[index].close(code, message);
        },

        /* Helper method to convert a uuid to an index of the socks array

        */
        usernameToIndex: async (username = "ej1llo") => {
			  const uuid = await Accounts.getAuth(username);
			  
            for(let i = 0; i < this.socks.length; i++) {
                if(this.socks[i].authorization === uuid) {
                    return i;
                }
            }

            // That UUID isn't a thing
            return -1;
        }
    }

    /* Checks whether a variable is a JSON object or not
        Returns true if it is an object
    */
    isJSONObject(variable) {
        return (
            typeof variable === 'object' &&
            variable !== null &&
            !Array.isArray(variable)
        );
    }
}

// Checks if a str is a JSON
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = Feet;

function getCurrentTime(beAnArray = false) { // if beAnArray is true, it will return an array with the same info 
    let now = null;
    let hours = null;
    let hours12 = null;
    let minutes = null;
    let seconds = null;

    try {
        now = new Date();

        hours = now.getHours();
        hours12 = hours % 12 || 12;
        minutes = now.getMinutes();
        seconds = now.getSeconds();

    } catch (error) {
        // error handling
        console.error("Failed to get the time!");
        return null;
    }

    // RETURN TIME

    // return string
    if(!beAnArray) {
        return `${hours}:${minutes}:${seconds}`;
    }
    
    // return array
    return [hours, minutes, seconds];
}

function fancyCurrentTime() {
    const now = new Date();

    // Get the current hour and convert to 12-hour format
    let hours = now.getHours();
    const isAM = hours < 12;
    hours = hours % 12 || 12; // Convert 0 to 12 for AM/PM formatting

    // Get the minutes and format them to 2 digits (e.g., 05, 32)
    let minutes = now.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Get the AM/PM string
    const ampm = isAM ? 'AM' : 'PM';

    // Format the time string
    return `${hours === 12 ? 12 : hours < 10 ? '0' + hours : hours}:${minutes}`;
}