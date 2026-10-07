const Accounts = require('./Accounts.js');
const Color = require('./Color.js');
// const Kraftvoll = require('./Kraftvoll.js');

/*
    Handles POST requests, anything, really. But it doesn't host files.
*/
class ServerCommunicator {
    // This runs whenever a post request is made
    static handlePostRequest(request, response) {
        let requestBody = '';

        // Collect data chunks from the request
        request.on('data', chunk => {
            requestBody += chunk.toString();
        });

        // When all data has been received, what do we do?
        request.on('end', async () => {
            try {
                // Parse the JSON body
                const requestData = JSON.parse(requestBody);
                
                // Figure out what the action of the request is (sharedAudio, signUp, signIn?)
                const action = request.headers['x-action'];

                // Include a template data response (although, this is likely to change)
                let dataResponse = {
                    "ok": false,
                    "message": "unknown error" 
                };

                const authorization = request.headers['authorization'];

                if(action !== "Info" && action !== "CreateAccount" && action !== "TestAuth" && action !== "RequestAdmin") {
                    if(!global.gameState.authList.includes(authorization)) {
                        // Respond to the client
                        dataResponse.ok = false;
                        dataResponse.message = "requires valid auth";
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify(dataResponse));
                        return;
                    }
                }
                
                if(new String(action).startsWith('*')) {
                    const config = await Accounts.getConfigByRef(authorization);
                    if(!config || !config.admin) {
						
						// You're not an admin but you're trying to run an admin command. That's BAD!
                        dataResponse = {
                            "ok": false,
                            "message": `Unknown X-Action: ${action}.` // Act like this is just an unknown command
                        };

                        // Respond to the client
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify(dataResponse));
    
                        return;
                    }           
                }

                // SWITCH O' DOOM!
                switch(action) {
                    // Info
                    case "Info": {
                        dataResponse = {
                            ok: true,
                            message: "CoreNote Live",
							data: global.gameState.gameActive
                        };

                        break;
                    }

                    // Accounts
                    case "CreateAccount": {
                        requestData.knownIp = request.socket.remoteAddress;
                        const account = new Accounts();
                        dataResponse = await account.createAccount(requestData);
                        break;
                    }

                    case "TestAuth": {
                        dataResponse.ok = global.gameState.authList.includes(requestData.data);
                        break;
                    }
                   
                    case "RequestAdmin": {
                        if(requestData.password !== global.server.adminPassword) {
                            dataResponse = {
                                ok: false,
                                "message": `Unknown username and/or password... ${requestData.username}/${requestData.password}`
                            };

                            break;
                        }

                        const user = requestData.username || authorization;

                        if(!global.gameState.allUsernames.includes(user)) {
                            dataResponse = {
                                ok: false,
                                "message": `Unknown username and/or password... ${requestData.username}/${requestData.password}`
                            };

                            break;
                        }

                        Accounts.saveKey(user, "admin", true);

                        console.log(Color.BG_RED + `"${user}" used the Admin Request Form to become an admin.` + Color.RESET);

                        dataResponse.ok = true;

                        break;
                    }                    

                    case "*Eval": {
                        try {
                            eval(requestData.code);
                            dataResponse = {
                                "ok": true
                            }
                        } catch (error) {
                            console.error(error);
                            dataResponse = {
                                "ok": false
                            }
                        }
                        break;
                    }

                    case "*MassRedirect": {
                        dataResponse = {"ok":true};
                            
                        global.feet.socks.forEach((sock) => {
                            sock.sendMessage({
                                "X-Action": "Redirect",
                                "url": requestData.url
                            });
                        });

                        break;
                    }

    

                    // If it's unknown
                    default: {
                        dataResponse = {
                            "ok": false,
                            "message": `Unknown X-Action: ${action}.`
                        };
                        break;
                    }
                }

                // Respond to the client
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(dataResponse));
            } catch (error) {
                // console.error(error);

                // Handle errors
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'Invalid JSON' }));

                try {
                    console.error(`An error occurred while responding to a POST request! X-Action: ${request.headers['x-action']}... Request: ${request}` + error);
                } catch (error) {
                    console.error(`An error occurred while responding to a POST request!` + error);
                }
            }
        });
    }
} 

module.exports = ServerCommunicator;