class Accounts {
    username = null;
    password = null;
    authorization = null;
    
    constructor(username = undefined, password = undefined) {
        if(username === undefined || username === undefined) {
            return;
        }

        this.signIn(username, password);
    }

    /*
        This allows the user to, get this, sign in. This is 
    */
    async signIn(username, password) {
        // Get the server
        let server = new ServerCommunicator();

        // Attempt a sign in with the current Username and Password
        const response = await server.template.post("SignInAccount", {"username": username, "password": password});

        // Make sure the response is okay
        if(!response.ok) {
            console.error("Failed to sign into your account! Response not ok. Message: " + JSON.stringify(response.message));
            return JSON.stringify(response.message);
        }

        console.log(response);
        // That account does exist! Yay!
        console.log(`Successfully signed into GCHNS.\nAuth key: ${response.authorization}\nFile auth key: ${response.authorization_file}\nUsername: ${username}\nPassword: ${password.substring(0, 3)}...`);

        // Save auth key to local storage
        chrome.storage.local.set({"authorization": response.authorization});

        // Save the username & password to local storage (used for automatic sign in)
        {
            // It's a UUID, don't save it to the username
            if(username.length === 36 || !password) {
                return response;
            }
    
            await chrome.storage.local.set({"username": response.username || username});
            await chrome.storage.local.set({"password": password});
        }
        

        // We win!
        return response;
    }

    /*
        This will sign you up via username and password. Then, it will automatically sign you in. If it fails, it will return the error message. If it's successful, it return true.
        It expects a JSON (in accountData), formatted as such:
        {
            "username": "Tyñeesha Kobeesha",
            "password": "qwerty",
            "fullName": "Tyler Koberna",
            "picture": null, // this is a blob 🤮
        }
    */
    async signUp(accountData) {
        // Make sure username and password are defined
        if((accountData.username === undefined || accountData.username === null) || (accountData.password === undefined || accountData.password === null)) {
            const message = "Unable to create the account! Did you fill in everything?"
            console.error(message);
            return message;
        }

        accountData.email = await getEmail();

        // Send to the server
        const server = new ServerCommunicator();
        const response = await server.template.post("CreateAccount", accountData);
        
        // Make sure it was successful
        if(!response.ok) {
            const message = `Unable to create the account! ${response.message}`;
            console.error(message);
            return message;        
        }

        await chrome.storage.local.set({"authorization": response.authorization});
        await chrome.storage.local.set({"username": accountData.username});
        await chrome.storage.local.set({"password": accountData.password});

        return true;
        
    }
}

function getEmail() {
    return new Promise((resolve, reject) => {
      chrome.identity.getProfileUserInfo(function(info) {
        if (info && info.email) {
          resolve(info.email);
        } else {
          resolve(null);
        }
      });
    });
  }