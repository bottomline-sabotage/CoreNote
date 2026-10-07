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

    /*  Sign in to an account
        Expects a JSON with {
            "username": whatever,
            "password": whatever,
        }
    */
    async signInAccount(data) {
        // data.username = toString(data.username);
        // data.password = toString(data.password);

        try {
			if(new String(data.username).length < 1 || new String(data.password).length < 1) {
	            return {
	                "ok": false,
	                "message": "Not enough information"
	            };
	        }
			
            data.username = data.username.trim(); // Trim the username
            data.password = data.password.trim(); // Trim the password
    
            data.username = data.username.toLowerCase();
        } catch (error) {
            return {
                "ok": false,
                "message": "Failed to log in! Unknown username and/or password."
            };
        }

        // Step two: assuming it was found, get the config file, and upload that JSON into the stack
        let accountConfig = null;
        {
            try {
                // Open the user's config file
                accountConfig = await Accounts.getConfigByRef(data.username);

                if(!accountConfig) throw new Error();
            } catch (error) {
                return {
                    "ok": false,
                    "message": `Failed to log in! Unknown username and/or password.`
                };
            }
        }

        // Step three: confirm the password
        {
            if(data.password !== accountConfig.password) {

                // See if there's a custom note for this username
                if(accountConfig.note) {
                    return { 
                        "ok": false,
                        "message": `Failed to log in, but a note was left: "${accountConfig.note}"`
                    }
                }

                return {
                    "ok": false,
                    "message": `Failed to log in! Unknown username and/or password.` 
                }
            }
        }

        // Step four: return the auth and auth_file key to the user
        {
            return {
                "ok": true,
                "authorization": accountConfig.authorization,
                "role": accountConfig.role,
                "username": accountConfig.username,
                "admin": accountConfig.admin
            };
        }
    }

    /* Creates account

    Expects this as its input: 
    {
            "username": "Tyñeesha Kobeesha",
            "password": "qwerty",
            "fullName": "Tyler Koberna",
            "picture": null, // this is a blob 🤮
    }
    */
    async createAccount(data) {
        // Get the list of usernames
        const USER_NAMES = await this.getNameList();

        if(new String(data.username).length < 1 || new String(data.password).length < 1) {
            return {
                "ok": false,
                "message": "Not enough information"
            };
        }

        // Make sure that list is an array (that method returns an error if the file can't be read)
        if(!Array.isArray(USER_NAMES)) {
            return {
                "ok": false,
                "message": USER_NAMES
            };
        }

        data.username = data.username.trim(); // Trim the username
        data.password = data.password.trim(); // Trim the password
        
        // Check if the username is taken.
        if(USER_NAMES.indexOf(data.username.toLowerCase()) !== -1) {

            return {
                "ok": false,
                "message": "Username Taken!"
            };
        }
       
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

        // Check password requirements
        {
            const requirements = this.passwordStandards(data.password);
            
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
            "fullName": data.fullName,
            "username": data.username,
            "password": data.password,
            "email": data.email,
            "admin": false,
            "knownIp": data.knownIp,
            "role": 0,
            "color": (data.color !== "#000000") ? data.color : `rgb(${global.gameState.getRandomNumber(1, 255)}, ${global.gameState.getRandomNumber(1, 255)}, ${global.gameState.getRandomNumber(1, 255)})`
        };

        // Save to Server
        {
            // Save to main user config file
            {
                if(data.note) {
                    accountData.note = data.note;
                }

                // Define the directory and file path
                const dirPath = path.join(`${global.serverFilePath}/Data/Users/Config/`);
                const filePath = path.join(dirPath, `${accountData.username.toLowerCase()}.json`); // username is used here because the log in system scans through here for usernames 

                try {
                    // Ensure the directory exists
                    await fs.mkdir(dirPath, { recursive: true });

                    // Write the JSON string to the file
                    await fs.writeFile(filePath, JSON.stringify(accountData), 'utf8');

                } catch (error) {
                    console.error('Error writing file:', error);
                    return {
                        "ok": false,
                        "message": error
                    };
                }
            }

            // Save to usernames list
            {
                const username = accountData.username.toLowerCase();

                // Define the directory and file path
                const dirPath = path.join(`${global.serverFilePath}/Data/Users/`);
                const filePath = path.join(dirPath, `Usernames.txt`);

                try {
                    // Ensure the directory exists
                    await fs.mkdir(dirPath, { recursive: true });

                    // What is going to be added to the file?
                    let assignment = null;

                    // Check whether a newline is needed
                    {
                        assignment = `\n${username}`
                    }

                    // Write the JSON string to the file
                    await fs.appendFile(filePath, assignment, 'utf8');
                } catch (error) {
                    console.error('Error writing file:', error);
                    return {
                        "ok": false,
                        "message": error
                    };
                }
            }

            // Save to auth ids list
            {
                const auth = accountData.authorization;

                // Define the directory and file path
                const dirPath = path.join(`${global.serverFilePath}/Data/Users/`);
                const filePath = path.join(dirPath, `Auth IDs.txt`);

                try {
                    // Ensure the directory exists
                    await fs.mkdir(dirPath, { recursive: true });

                    // What is going to be added to the file?
                    let assignment = null;

                    // Check whether a newline is needed
                    {
                        assignment = `\n${auth}`
                    }

                    // Write the JSON string to the file
                    await fs.appendFile(filePath, assignment, 'utf8');
                } catch (error) {
                    console.error('Error writing file:', error);
                    return {
                        "ok": false,
                        "message": error
                    };
                }
            }

            // Save to linker file
            {
                
                try {
                    // Open current linker file
                    const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Linker.json`);
                    let linker = JSON.parse(response);

                    // Add the key to the local one
                    linker[accountData.authorization] = accountData.username.toLowerCase(); // make it lowercase

                    // Commit changes
                    await fs.writeFile(`${global.serverFilePath}/Data/Users/Linker.json`, JSON.stringify(linker));
                } catch (error) {
                    console.error('Error writing file:', error);
                    return {
                        "ok": false,
                        "message": error
                    };
                }     
            }

            // Save to profile pictures
            {
                // if(!data.picture) {
                //     const photo = await fs.readFile(`${global.serverFilePath}/assets/img/no profile.png`);
                    
                //     data.picture = photo.toString('base64');
                // }

                // Ensure that data.picture is valid (i.e., not null or undefined)
                if (data.picture) {
                    const base64Image = data.picture.split(';base64,').pop(); // Remove the Data URI scheme prefix
                    const imageBuffer = Buffer.from(base64Image, 'base64');

                    // Define the file path where the image will be saved
                    const imagePath = path.join(global.serverFilePath, 'Data', 'Users', 'Pfp', `${data.username}.png`);

                    try {
                        // Ensure the directory exists (if not, create it)
                        await fs.mkdir(path.dirname(imagePath), { recursive: true });
                        rescaleImage(imageBuffer, 256, 256, true, imagePath);
                        
                        
                    } catch (err) {
                        console.error('Error saving profile picture:', err);
                    }
                } else {
                    console.error('No picture data provided');
                }
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

    /*  Will return all used usernames
    */
    async getNameList() {
        try {
            const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Usernames.txt`, {"encoding": "utf-8"});

            return response.trim().toLowerCase().split('\n').filter(line => line.trim());
        } catch (error) {
            return "Failed to load accounts from the server!: " + error;
        }
    }

    async getAuthKeyList() {
        try {
            const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Auth IDs.txt`, {"encoding": "utf-8"});

            return response.trim().split('\n').filter(line => line.trim());
        } catch (error) {
            return "Failed to load auth keys from the server!: " + error;
        }
    }
    
    async getAuthKeys() {
        const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Auth IDs.txt`, {"encoding": "utf-8"});
        return response;
    }

    /* Checks password according to guidelines
        This will verify that a password is under standard:
            • 5 characters or above
            • 30 characters or less
            • Can't contain spaces

        It will return "true" if it's up to snuff. It will return the reason it failed if it fails
    */
    passwordStandards(password) {
        let reasoning = "";
        let fuck = true; // true means that it passes
        
        // Preform tests
        {
            // Check if the password is defined
            if(password.trim().length < 1) {
                return "Passwords are mandatory!";
            }

            // Check if it's 5 characters (or above)
            if(password.length < 5) {
                fuck = false;
                reasoning += "Passwords have to be 5 characters or over. ";
            }

            // Check if it's 30 characters (or less)
            if(password.length > 30) {
                fuck = false;
                reasoning += "Password cannot be more than 30 characters. ";
            }

            // Checks for spaces
            if(password.indexOf(' ') !== -1) {
                fuck = false;
                reasoning += "Passwords cannot contain spaces. ";
            }
        }
        
        // If all tests passed
        if(fuck) {
            return true;
        }

        // If one or more tests failed
        return reasoning;
    }

     /* Checks username according to guidelines
        This will verify that a username is under standard:
            • 1 character or above
            • 30 characters or less
            • Can't contain symbols
            • Can't contain the n-word or f-slur
            • Can't be a reserved username
                - anything with 'pfp'
                - sudo

        It will return "true" if it's up to snuff. It will return the reason it failed if it fails
    */
    usernameStandards(username) {
        let reasoning = "";
        let fuck = true; // true means that it passes
        
        // Allow some people to break these rules, if they so please (me)
        const ruleBreakers = ["tyler koberna", "tyñeesha kobeesha", "tyñeesha"];
        if(ruleBreakers.some(user => username.toLowerCase() === user.toLowerCase())) {
            return true;
        }


        // Preform tests
        {
            // Check if it's 5 characters (or above)
            if(username.length < 1) {
                return "Usernames are mandatory!"; // all of the other tests will be fail. just return it.
            }

            // Check if it's more than 30 characters
            if(username.length > 30) {
                fuck = false;
                reasoning += "Usernames cannot be above 30 characters. ";
            }
    
            // Check if it contains symbols
            if(/[!@#$%^&*(),.?":{}|<>áÁéÉíÎóÓúÚñÑ´˜👑🇦🇫]/.test(username)) {
                fuck = false;
                reasoning += "Usernames cannot contain symbols. ";
            }

            // Check if it contains the n-word
            if(username.toLowerCase().includes('nigger') || username.toLowerCase().includes('nigga') || username.toLowerCase().includes('nig ger') || username.toLowerCase().includes('niger')) {
                fuck = false;
                reasoning += "Your username contains a banned word. ";
            }

            // Check if it contains the f-slur
            if(username.toLowerCase().includes('faggot') || username.toLowerCase().includes('fag got')) {
                fuck = false;
                reasoning += "Your username contains a banned word. ";
            }
            
            // Check for reserved / banned usernames / username inclusions
            if(username.toLowerCase().includes('pfp') || username.toLowerCase().includes('sudo') || username.toLowerCase().includes('\n')) {
                fuck = false;
                reasoning += "Your username contains a reserved word, name, or phrase.";
            }

        }
        
        // If all tests passed
        if(fuck) {
            return true;
        }

        // If one or more tests failed
        return reasoning;
    }

    // async changeProfilePicture(body) {
    //     const data = body.picture;
    //     const name = body.username;
        
    //     // Ensure that data.picture is valid (i.e., not null or undefined)
    //     if (data) {
    //         const base64Image = data.split(';base64,').pop(); // Remove the Data URI scheme prefix
    //         const imageBuffer = Buffer.from(base64Image, 'base64');

    //         // Define the file path where the image will be saved
    //         const imagePath = path.join(global.serverFilePath, 'Data', 'Users', 'Pfp', `${name}.png`);

    //         try {
    //             // Ensure the directory exists (if not, create it)
    //             await fs.mkdir(path.dirname(imagePath), { recursive: true });

    //             // Write the image to the file system
    //             // await fs.writeFile(imagePath, imageBuffer);

    //             await rescaleImage(imageBuffer, 256, 256, true, imagePath);

    //             global.feet.socks.forEach( async (sock) => {
    //                 if(await Accounts.getAuth(name) === sock.authorization) return;

    //                 sock.sendMessage({
    //                     "X-Action": "ProfilePictureChange",
    //                     "data": name
    //                 });
    //             });

    //             return {
    //                 "ok": true,
    //                 "message": undefined
    //             };
    //         } catch (err) {
    //             console.error('Error saving profile picture:', err);
                
    //             return {
    //                 "ok": false,
    //                 "message": err
    //             };
    //         }
    //     } else {
    //         console.error('No picture data provided');

    //         return {
    //             "ok": false,
    //             "message": "No picture found"
    //         };

    //     }
    // }

    /* Generates file auth ids with a full name
        Will generate the {lastname}{firstinitial} user id, then return it
    */
    async generateNewFileAuthKey(name = null) {
        // Make sure it's defined
        if(name === null || name === undefined) {
            return;
        }

        // Set it to lower case
        name = name.toLowerCase();

        // Remove special characters
        name = name.replace(/[^a-zA-Z ]/g, '');

        // Trim
        name = name.trim();

        // Split into an array
        const splitPosition = name.indexOf(' ');
        if(splitPosition === -1) {
            console.warn("Unable to create auth key!");
            return false;
        }
        let names = [name.substring(splitPosition + 1), name.substring(0, splitPosition)];

        // Convert into (pretty much) final form:
        let i = 1;
        let list = null;
        do {
            list = await this.getFileAuthKeyList();

            // Make sure the people list is an array (it'll just be an error otherwise)
            if(!Array.isArray(list)) {
                return false;
            }

            if(i > names[1].length) {
                console.error("Failed to create auth key! All tried keys are taken!"); // yay! not coming up with an actual solution! Hell, yeah!
                return false;
            }

            name = `${names[0]}${names[1].substring(0, i)}`;
            i++;
        } while(list.indexOf(name) !== -1); // do while another name exists

        // Remove spaces
        name = name.replace(/ /g, ''); // globally removes spaces


        return name;
    }

    static async getUsername(auth) {
        if(global.usernameAuthCache[auth]) {
            return global.usernameAuthCache[auth];
        }

        try {
            const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Linker.json`, {encoding: "utf-8"});

            const data = JSON.parse(response);

            global.usernameAuthCache[auth] = data[auth];

            return data[auth];
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    static async getAuth(username) {
        
        try {
            username = username.toLowerCase(); // Set to lowercase
            
            if(global.usernameAuthCache[username] && global.usernameAuthCache[username].length == 36) {
                return global.usernameAuthCache[username];
            }

            const response = await fs.readFile(`${global.serverFilePath}/Data/Users/Linker.json`, { encoding: "utf-8" });
            
            const data = JSON.parse(response);
            
            for (const [auth, user] of Object.entries(data)) {
                if (user === username) {
                    global.usernameAuthCache[username] = auth;
                    
                    return auth;
                }
            }

            return undefined; // Return undefined if no match is found
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
	
	// Takes an UUID, fileAuth (TODO:), or username to get the user config. Returns null if not found
	static async getConfigByRef(playerRef = "ej1llo") {
		// Check for Auth
		if(playerRef.length === 36) {
			const username = await Accounts.getUsername(playerRef);
			
			if(username) {
				try {
					return JSON.parse(await fs.readFile(`${global.serverFilePath}/Data/Users/Config/${username}.json`));
				} catch (error) {
					return null;
				}
			}
		}
		
		// Check for username
		try {
			 return JSON.parse(await fs.readFile(`${global.serverFilePath}/Data/Users/Config/${playerRef}.json`));
		} catch (error) {
			return null;
		}
	}
	
	// Save a config by ref (username or uuid)
	static async saveConfigByRef(playerRef = "ej1llo", config = {}) {
		// Check for Auth
		if(playerRef.length === 36) {
			const username = await Accounts.getUsername(playerRef);
			
			if(username) {
				try {
					await fs.writeFile(`${global.serverFilePath}/Data/Users/Config/${username}.json`, JSON.stringify(config));
					
					return true;
				} catch (error) {
					return false;
				}
			}
		}
		
		// Check for username
        if (!writeQueue.has(playerRef)) {
            writeQueue.set(playerRef, Promise.resolve());
        }
    
        writeQueue.set(playerRef, writeQueue.get(playerRef).then(async () => {
            try {
                const string = JSON.stringify(config);
                await fs.writeFile(`${global.serverFilePath}/Data/Users/Config/${playerRef}.json`, string);
                return true;
            } catch (error) {
                console.warn(error);
                return false;
            }
        }));
    
        return writeQueue.get(playerRef);
	}
	
	// Obtains a config from user. Boolean response
	static async getKey(playerRef = "ej1llo", key) {
		try {
			const config = await Accounts.getConfigByRef(playerRef);
			
			if(!config) {
				throw new Error();
			}
			
			return config[key];
		} catch (error) {
			return false;
		}
	}
	
	// Save a key to a user config. Boolean response
	static async saveKey(playerRef = "ej1llo", key, newValue) {
		try {
			const config = await Accounts.getConfigByRef(playerRef);
			
			if(!config) {
				throw new Error();
			}
			
			config[key] = newValue;

			await Accounts.saveConfigByRef(playerRef, JSON.parse(JSON.stringify(config)));
			
			return true;
		} catch (error) {
			return false;
		}
	}
}

module.exports = Accounts;