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

    async signUp(accountData) {
        // Make sure username and password are defined
        if((accountData.username === undefined)) {
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
            return {
                ok: false,
                message: message
            };        
        }

        await chrome.storage.local.set({"authorization": response.authorization});
        await chrome.storage.local.set({"username": accountData.username});
        // await chrome.storage.local.set({"password": accountData.password});

        return {
            ok: true,
            auth: this.authorization
        };        
    
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