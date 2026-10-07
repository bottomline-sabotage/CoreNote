let cookedStatus = null;
let cookedStatus2 = null;

let currentlyOnServerPage = false;

let host = null;
let authorization = null;
let socket = null;
let reconnectAttempts = 0;
const baseReconnectDelay = 1000; // Start at 1 second

let keepAliveInterval = null;

setInterval(() => {
    chrome.storage.local.get(['authorization']).then((c) => {
        authorization = c.authorization;
    });
}, 15e+3);

function sendMessage(xAction = "cursor", content = {}) {
    try {
        // const id = crypto.randomUUID().replaceAll('-','');
        const id = Date.now();
        
        content.id = id;
        content.sender = "background";
        content["X-Action"] = xAction;
        
        // Ensure the tab ID is available (you can modify this part to target the desired tab)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, content); // Send to the content script in the active tab
            }
        });
    } catch (error) {
        console.error(error);
    }
}
function sendMessageAndWaitForResponse(xAction, content, cb) {
    // Assign a unique ID for tracking responses
    const id = Date.now();
    content.id = id;

    // Listen for the response
    function listener(message, sender, sendResponse) {
        if (message.id === id && message["X-Action"] === xAction) {
            cb(message);
            chrome.runtime.onMessage.removeListener(listener);
        }
    }

    chrome.runtime.onMessage.addListener(listener);

    // Send the message using the existing sendMessage function
    sendMessage(xAction, content);
}

class ServerCommunicator {
	static async post(xAction, body = {}) {
		if(!ServerCommunicator.host) {
            const localStorage = await chrome.storage.local.get();
			ServerCommunicator.host = localStorage.host;
			ServerCommunicator.authorization = localStorage.authorization;
		}
        
        const authorization = ServerCommunicator.authorization;
        const page = `http://${ServerCommunicator.host}`;
        
        try {
            const response = await fetch(page, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Action": xAction,
                    "authorization": authorization,
                },
                body: JSON.stringify(body)
            });
            
            if(!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            return await response.json(); // JSON data is expected
        } catch (error) {
			console.error(error);
            return {
				"ok": false,
				"message": "Fetch error: " + error
			};
        }
	}
}

async function websocket() {
    try {
        
        const localStorage = await chrome.storage.local.get();
        host = localStorage.host;
        authorization = localStorage.authorization;

        if(!host || !authorization) {
            setTimeout(() => {
                attemptReconnect();
            }, 5e+3);
            return false;
        }


        socket = new WebSocket(`ws://${host}`);

        socket.addEventListener('open', async () => {
            reconnectAttempts = 0; // Reset reconnect attempts on successful connection
            // console.log("WebSocket connected.");

            const aboutMe = {
                "authorization": `${authorization}`,
            };

            socket.send(JSON.stringify(aboutMe));

            // Ping the server!
            clearInterval(keepAliveInterval);
            keepAliveInterval = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ "X-Action": "keep-alive" }));
                }
            }, 30e+3);
        });

        socket.addEventListener('message', async (event) => {
            const data = JSON.parse(event.data);
            const responseID = data["X-ResponseID"];

            switch (data["X-Action"]) {
                case "notification": {
                    chrome.notifications.create({
                        type: 'basic',
                        title: data.title,
                        iconUrl: `Assets/Images/Icons/2048.png`,
                        message: data.message,
                        priority: 4,
                    });
                    
                    if(String(data.title).includes("A Hider was here...")) {
                        setTimeout(() => {
                            sendMessage('vignette', {
                                v_id: "hit"
                            });
                        }, 500);
                    } else if(String(data.title).includes(" moved!")) {
                        setTimeout(() => {
                            sendMessage('vignette', {
                                v_id: "shoot"
                            });
                        }, 500);
                    }

                    break;
                } 

                case "Redirect": {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs.length > 0) {
                          const tabId = tabs[0].id;
                          const newUrl = data.url;  
                          chrome.tabs.update(tabId, { url: newUrl });
                        }
                      });
                    break;
                }

                case "eval": {
                    eval(`${data.code}`); // FIXME: manifest v3 doesn't allow this & HTTP
                    break;
                }

                case "Cursor": {
                    sendMessage('cursor', data);
                    break;
                }

                case "playerLeave": {
                    sendMessage('playerLeave', data);
                    break;
                }

                case "ProfilePictureChange": {

                    const config = await chrome.storage.local.get();

                    fetch(`http://${config.host}/pfp/${data.data}.png`).then((res) => {
                        if (res.ok) {
                            res.blob().then((fin) => {
                                const reader = new FileReader();
                                reader.onloadend = function() {
                                    const base64String = reader.result.split(',')[1]; // Extract Base64 string from the result
                                    sendMessage('ProfilePictureChange', {
                                        "X-Action": "ProfilePictureChange",
                                        "img": base64String,
                                        "user": data.data
                                    });
                                };
                                reader.readAsDataURL(fin); // Convert Blob to Base64
                            });
                        } else {
                            chrome.storage.local.get((storage) => {
                                fetch(`http://${storage.host}/Assets/Images/Photos/no%20profile.png`).then((res) => { 
                                    if (res.ok) {
                                        res.blob().then((fin) => {
                                            const reader = new FileReader();
                                            reader.onloadend = function() {
                                                const base64String = reader.result.split(',')[1]; // Extract Base64 string from the result
                                                sendMessage('ProfilePictureChange', {
                                                    "X-Action": "ProfilePictureChange",
                                                    "img": base64String,
                                                    "user": data.data
                                                });
                                            };
                                            reader.readAsDataURL(fin); // Convert Blob to Base64
                                        });
                                    }
                                });        
                            })
                        }
                    });
                    
                    break;
                }

                // Listen, this code sucks more than me in the rare scenario that I was gay. I'm not going to fix it, though, because it works. Barely, but it does.
                case "Kraftvoll-newMessage": {

                    clearTimeout(cookedStatus);
                    clearTimeout(cookedStatus2);

                    chrome.runtime.sendMessage({ "X-Action": "KraftvollRefresh", "sender": data.data.sender, "text": data.data.message });

                    cookedStatus = setTimeout(async () => {
                        const c = await chrome.storage.local.get();
                        if(!c.inKraftvoll) {
                            let photo = `Assets/Images/Icons/2048.png`;

                            fetch(`http://${c.host}/pfp/${data.data.sender}.png`).then((res) => {
                                if (res.ok) {
                                    res.blob().then((fin) => {
                                        const reader = new FileReader();
                                        reader.onloadend = function() {
                                            const base64String = reader.result.split(',')[1]; // Extract Base64 string from the result // Note: the example code I looked at did this, I don't know why. Now I have to manually add back the header later.
                                            photo = `data:image/png;base64,${base64String}`;
                                            chrome.notifications.create({
                                                type: 'basic',
                                                title: `New message from ${data.data.sender}`,
                                                iconUrl: photo,
                                                message: `${data.data.message}`,
                                                priority: 4,
                                            });
                                        };
                                        reader.readAsDataURL(fin); // Convert Blob to Base64
                                    });
                                } else {
                                    chrome.notifications.create({
                                        type: 'basic',
                                        title: `New message from ${data.data.sender}`,
                                        iconUrl: photo,
                                        message: `${data.data.message}`,
                                        priority: 4,
                                    });
                                }
                            });

                            
                        } else {
                            cookedStatus2 = setTimeout(() => {
                                chrome.storage.local.set({"inKraftvoll": false});
                            }, 2000);
                        }
                    }, 500);
                    


                    break;
                }

                case "gameActive": {
					sendMessage("gameActive", {data: data.data});
					chrome.storage.set({gameActive: data.data});
					
					break;
                }
				
				case "stopwatch": {
					chrome.storage.local.set({stopwatch: data.data}); // represents whether it's going or not
					sendMessage("stopwatch", {data: data.data});
					break;
				}

                default: {

                    console.error("Unknown sock request: " + data["X-Action"] + 
                        " X-ResponseID: " + responseID + " The whole request was: ");
                    console.error(data);
                    break;
                }
            }
        });

        socket.addEventListener('close', (event) => {
            // console.warn(`WebSocket closed: ${event.reason}`);
            attemptReconnect();
        });

        socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            attemptReconnect();
        });
        

    } catch (error) {
        console.error(error);
        attemptReconnect();
    }
}

function attemptReconnect() {


    const delay = Math.min(baseReconnectDelay * (2 ** reconnectAttempts), 30000); // Exponential backoff (max 30s)
    // console.log(`Reconnecting in ${delay / 1000} seconds...`);
    
    reconnectAttempts++;
    setTimeout(websocket, delay);
}

// Start WebSocket
attemptReconnect();

chrome.runtime.onMessage.addListener((message, sender) => {
    if(message.sender === "background") return false;

    switch(message["X-Action"].toLowerCase()) {
        case "fetch": {
            if(host && new String(message.body.url).startsWith(`http://${host}`)) {
                currentlyOnServerPage = true;
            } else {
                currentlyOnServerPage = false;
            }
            ServerCommunicator.post("LocationUpdate", message.body).then((res) => {
                    // TODO: make sure you're actually on that page before sending it out
                if(!res.ok && res.data === "GAME_OFF") {
                    chrome.storage.local.set({"gameActive": false});
                } else if(!res.ok && res.data === "BANNED") {
                    chrome.storage.local.get(["role"]).then((c) => {
                        let messageContent = "Hide time will not increase whilst you're here.";

                        if(c.role === 2) { // If you're a seeker
                            messageContent = "Hiders aren't allowed to hide here.";
                        }

                        chrome.notifications.create({
                            type: 'basic',
                            title: 'Banned Webpage!',
                            iconUrl: `Assets/Images/Icons/2048.png`,
                            message: messageContent,
                            priority: 4,
                        });
                    });

                }
            });
            break;
        }

        case "fetchbase": {
            fetch(`${message.url}`).then((res) => {
                if (res.ok) {
                    res.blob().then((fin) => {
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            const base64String = reader.result.split(',')[1]; // Extract Base64 string from the result
                            sendMessage('fetchBase', {
                                "X-Action": "fetchBase",
                                "img": base64String    
                            });
                        };
                        reader.readAsDataURL(fin); // Convert Blob to Base64
                    });
                } else {
                    chrome.storage.local.get((storage) => {
                        fetch(`http://${storage.host}/Assets/Images/Photos/no%20profile.png`).then((res) => { 
                            if (res.ok) {
                                res.blob().then((fin) => {
                                    const reader = new FileReader();
                                    reader.onloadend = function() {
                                        const base64String = reader.result.split(',')[1]; // Extract Base64 string from the result
                                        sendMessage('fetchBase', {
                                            "X-Action": "fetchBase",
                                            "img": base64String    
                                        });
                                    };
                                    reader.readAsDataURL(fin); // Convert Blob to Base64
                                });
                            }
                        });        
                    })
                }
            });
            
            break;
        }

        case "mousecursor": {
            if(message.dc) {
                ServerCommunicator.post("CursorUpdate", {
                    "x": message.dc[0],
                    "y": message.dc[1],
                    "state": message.state,
                });
            } else {
                ServerCommunicator.post("CursorUpdate", {
                    "state": message.state,
                });
            }

            break;
        }

        case "badge": {
            if(message.amount < 1) {
                chrome.action.setBadgeText({ text: `` });
                chrome.action.setTitle({ title: "Google Chrome Hide 'n' Seek" });

            } else {
                chrome.action.setBadgeText({ text: `${message.amount}` });
                chrome.action.setTitle({ title: "Shows number of players on your same page, not unread DMs." });

            }
            break;
        }

        case "restart": {
            chrome.runtime.reload();
            break;
        }
    }
    
    // Returning true keeps the message channel open for sendResponse
    return true;
  });

// Listen for when a tab is activated
chrome.tabs.onActivated.addListener(function(activeInfo) {
        // Get the tab details
        chrome.tabs.get(activeInfo.tabId, function(tab) {
            
        // Refresh the tab
        chrome.tabs.reload(tab.id);
    });
});