class ServerCommunicator {
    static connectedToWebSocket = false;

    static config = {
        "timeoutForWSConnection": false
    };
	
	static host = undefined;
	static authorization = undefined;

    // TODO: move to background script
    async websocket() {
        try {
            loadingIcon(true);
			
			if(!ServerCommunicator.host) {
				const localStorage = await chrome.storage.local.get();
				ServerCommunicator.host = localStorage.host;
				ServerCommunicator.authorization = localStorage.authorization;
			}

            // Create a WebSocket connection to the server
            const socket = new WebSocket(`ws://${ServerCommunicator.host}/`);

            // Event listener for when the connection is opened
            socket.addEventListener('open', async (event) => {
                loadingIcon(false);

      
                console.log('Connected to WebSocket server');
                const aboutMe = {
                    "authorization": localStorage.getItem('authorization'),
                    "useragent": window.navigator.userAgent,
                    "currentUrl": window.location.href,
                    "platform": window.navigator.platform,
                    "time": getCurrentTime(),
                };
    
                console.log("Sending the following to WebSockets");
                console.log(aboutMe);
    
                // Send a message to the server after the connection is open
                socket.send(JSON.stringify(aboutMe));

                // Log in
                {   
                    try {
                        loadingIcon(true);
                
                        let account = new Accounts();
                        account.signIn(localStorage.getItem("username"), localStorage.getItem("password")).then((response => {
                            if(response.ok !== true) {
                                // Remove web data account stuff
                                localStorage.removeItem("authorization");
                                localStorage.removeItem("authorization_file");
                                localStorage.removeItem("username");
                                localStorage.removeItem("password");
                
                                // Redirect to log in page
                                window.location.href = "/index.html";
                            }

                            localStorage.setItem('role', response.role);
                            deadHandler();
                            
                            loadingIcon(false);
                        }));
                    } catch (error) {
                        window.location.href = "/";
                    }
                }
            });
    
            // Event listener for receiving messages from the server
            socket.addEventListener('message', async (event) => {

                const data = JSON.parse(event.data);
				const responseID = data["X-ResponseID"];
					 
        
                switch(data["X-Action"]) {
                  

                    default: {
                        console.error("Unknown sock request: " + data["X-Action"] + "X-ResponseID: " + responseID + " The whole request was: ");
                        console.error(data);
                        break;
                    }
                }            
            });
    
            // Event listener for when the connection is closed
            socket.addEventListener('close', (event) => {
                console.log(event.reason);
                LogWindowMethods.sockDisconnect(event.reason);
            });
    
            // Event listener for error handling
            socket.addEventListener('error', (event) => {
                console.error('WebSocket error: ', event.reason);
            });
    
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    template = {
        post: async (xAction, body = {}) => {

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
                return null;
            }
        },

        
    }
	
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