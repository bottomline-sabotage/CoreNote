let inConversation = false;
const windowEventListener = [
    // ["name", "func"]
];
let globalLoadMessages = () => {

};

const back = document.getElementById('back');
back.addEventListener('click', () => {
    if(!inConversation) {
        try {
            document.getElementById('back').style.display = "none";
        } catch (error) {
    
        }
        blur(true);
    
        const div = document.createElement('div');
        div.style.opacity = 0;
        div.className = "dialogue_box";
        document.body.appendChild(div);
    
        const titleBar = document.createElement('span');
        titleBar.className = "dialogue_box-title_bar";
        titleBar.innerText = "Do you want to go back?";
        div.appendChild(titleBar);
    
        const message = document.createElement('div');
        message.className = "dialogue_box-message";
        div.appendChild(message)
    
        const yes = document.createElement('button');
        yes.className = "dialogue_box-button";
        yes.innerText = "Sure"
        message.appendChild(yes);
    
        const no = document.createElement('button');
        no.className = "dialogue_box-button";
        no.innerText = "Hell no!"; // I really wanted to put "NO! IM A MINOR!" but that wouldn't fit on one line
        message.appendChild(no);
    
        setTimeout(() => {
            div.style.opacity = 1;
        }, 10);
    
        yes.onclick = async () => {
                // if(data.host) {
                //     chrome.windows.create({
                //         url: `http://${data.host}/Kraftvoll`,
                //         type: "popup",
                //         width: 800,
                //         height: 600
                //     });                
                // }
    
                window.location.href = "/MainPage.html";
    
                blur(false);
                setTimeout(() => {
                    try {
                        document.getElementById('back').style.display = "inline";
                    } catch (error) {
        
                    }
                }, 500);
                div.style.opacity = 0;
        
                setTimeout(() => {
                    div.remove();
                }, 500);
        };
        
        no.onclick = () => {
            blur(false);
            setTimeout(() => {
                try {
                    document.getElementById('back').style.display = "inline";
                } catch (error) {
    
                }
            }, 500);
            div.style.opacity = 0;
    
            setTimeout(() => {
                div.remove();
            }, 500);
        };

    } 

    // In the main menu
    else {
        for(let i = 0; i < windowEventListener.length; i++) {
            window.removeEventListener(windowEventListener[i][0], windowEventListener[i][1]);
        }
        inConversation = false;
        globalLoadMessages = () => {};
        loadUsers();
    }
});

const add = document.getElementById('new_channel');
add.addEventListener('click', () => {
    blur(true);

    const div = document.createElement('div');
    div.style.opacity = 0;
    div.className = "dialogue_box";
    document.body.appendChild(div);
    div.style.width = "70vw"
    div.style.overflow = "auto";
    const titleBar = document.createElement('span');
    titleBar.className = "dialogue_box-title_bar";
    titleBar.innerText = "Create Channel";
    titleBar.style.marginBottom = "40px";
    div.appendChild(titleBar);

    setTimeout(() => {
        div.style.opacity = 1;
    }, 10);

    const buttons = document.createElement('div');
    buttons.style.cssText =`display: flex;
                            justify-content: space-between; 
                            align-items: center; 
                            padding: 10px;
                            background-color: rgb(24, 25, 27);
                            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
                            margin-top: 15px;`;
                            
    div.appendChild(buttons);
    
    const users = document.createElement('div');
    users.style.backgroundColor = "rgb(24, 25, 27)";
    users.style.overflow = "auto";
    users.style.height = "120px"; 

    div.appendChild(users);

    const message = document.createElement('div');
    message.className = "dialogue_box-message";
    div.appendChild(message)
    const inputs = [];

    const count = document.createElement('span');

    const addUserFunction = () => {
        const i = inputs.length;
        inputs.push(document.createElement('input'));
        inputs[i].placeholder = "Username";
        inputs[i].style.fontSize = "3vh"
        inputs[i].style.width = "40%"
        users.appendChild(inputs[i]);
        count.innerText = inputs.length;
    };

    const removeUserFunction = () => {
        if(inputs.length < 2) {
            try {
                inputs[0].value = "";
            } catch (error) {

            } finally {
                return;
            }
        }

        inputs[inputs.length - 1].remove();
        inputs.splice(inputs.length - 1, 1);
        count.innerText = inputs.length;
    };

    addUserFunction();

    const removeUserButton = document.createElement('span');
    removeUserButton.onclick = removeUserFunction;
    removeUserButton.innerText = "-";
    removeUserButton.style.fontSize = "1rem";
    removeUserButton.style.cursor = "pointer";
    removeUserButton.title = "Remove user";
    buttons.appendChild(removeUserButton);

    buttons.appendChild(count);

    const addUserButton = document.createElement('span');
    addUserButton.onclick = addUserFunction;
    addUserButton.innerText = "+";
    addUserButton.style.fontSize = "1rem";
    addUserButton.style.cursor = "pointer";
    addUserButton.title = "Add user";
    buttons.appendChild(addUserButton);


    
    {
        const yes = document.createElement('button');
        yes.className = "dialogue_box-button";
        yes.innerText = "Create";
        yes.style.fontSize = ".56rem";
        message.appendChild(yes);
    
        const no = document.createElement('button');
        no.className = "dialogue_box-button";
        no.style.fontSize = ".56rem";
        no.innerText = "Cancel"; // I really wanted to put "NO! IM A MINOR!" but that wouldn't fit on one line
        message.appendChild(no);

        message.appendChild(document.createElement('br'));

        const preview = document.createElement('span');
        preview.id = "preview";
        message.appendChild(preview);
    
        yes.onclick = async () => {
            {
               

                const array = [];
                for(let i = inputs.length - 1; i >= 0; i--) {
                    inputs[i].value.trim();
                    if(!inputs[i] || !inputs[i].value) {
                        inputs[i].remove();
                        inputs.splice(i, 1);
                        continue;
                    }

                    array.push(inputs[i].value);
                }

                count.innerText = array.length;

                const res = await ClientKraftvoll.backEnd.createChannel(array);
                if(res && !res.ok) {
                    preview.innerText = res.message;
                    if(res.message === undefined) {
                        blur(false);
                        div.style.opacity = 0;
                        setTimeout(() => {
                            div.remove();
                        }, 500);
                    }
                } else if(res && res.ok) {
                    blur(false);
                    div.style.opacity = 0;
                    setTimeout(() => {
                        div.remove();
                    }, 500);
                }
            }

            loadUsers();
        };
        
        no.onclick = () => {
            {
                blur(false);
    
                div.style.opacity = 0;
        
                setTimeout(() => {
                    div.remove();
                }, 500);
            }

            loadUsers();
        };
    }
});

async function loadUsers() {
    document.body.style.cursor = "progress";
    const parentDiv = document.getElementById('user_list');
    parentDiv.innerHTML = "Loading Conversations...";
    const list = await ClientKraftvoll.backEnd.viewChannels();
    parentDiv.innerHTML = "";

    document.body.style.cursor = "auto";
    
    for(let i = 0; i < list.length; i++) {
        const id = list[i][0];

        const div = document.createElement('div');
        
        const title = document.createElement('button');
        title.className = "kraftvoll-channel_button";
        let moreThanTwo = (list[i][1].length > 2);
        
        const config = await chrome.storage.local.get();

        for(let x = list[i][1].length - 1; x >= 0; x--) {
            if(new String(list[i][1][x]).toLowerCase().trim() === new String(config.username).toLowerCase().trim()) {
                list[i][1].splice(x, 1);
                break;
            }
        }

        for(let x = 0; x < list[i][1].length; x++) {
            title.innerText += (title.innerText.length < 1) ? `${list[i][1][x]}` : ` + ${list[i][1][x]}`;
            title.title = `Channel ID: ${id}`;
        }
        const convoTitle = title.innerText;

        
        div.appendChild(title);
        
        parentDiv.appendChild(div);

        title.onclick = async () => {
            inConversation = true;

            parentDiv.innerHTML = "";
            const title = document.createElement('h2');
            title.innerText = convoTitle;
            title.title = `Channel ID: ${id}`;
            title.style.cursor = "default";
            title.style.textAlign = "center";
            title.style.marginLeft = "5%";
            parentDiv.appendChild(title);

            const hr = document.createElement('hr');
            hr.style.cssText = `
                width: 90%;
                border: 0;
                border-top: 2px solid #888; 
                border-radius: 15px;
                background-color: transparent; 
                margin: 20px auto;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            `;
            parentDiv.appendChild(hr);

            const messagesDiv = document.createElement('div');
            // messagesDiv.style.overflowWrap = "break-word";
            // messagesDiv.style.wordBreak = "break-all";
            messagesDiv.style.margin = "5%";
            messagesDiv.style.display = "block";
            messagesDiv.style.height = "59%";
            messagesDiv.style.overflow = "auto";
            messagesDiv.id = "messages_div";
            parentDiv.appendChild(messagesDiv);
            document.body.style.cursor = "progress";

            let index = 1;

            const loadMessages = function() {
                if(index === 1) messagesDiv.innerHTML = "";
                ClientKraftvoll.backEnd.loadMessages(id, index).then(async (messages) => {
                    // const loadButton = document.createElement('button');
                    // loadButton.innerText = (getRandomNumber(0, 49) === 0 ? "FEED ME" : "Load More");
                    // loadButton.style.fontSize = "2vh";
                    // loadButton.onclick = () => {
                    //     loadMessages();
                    //     loadButton.remove();
                    // };
                    // messagesDiv.appendChild(loadButton);

                    try {
                        if(!messages.ok) {
                            throw new Error(`${messages.message}`);
                        }
                        
                        const config = await chrome.storage.local.get();
                        
                        document.body.style.cursor = "auto";
                        
                        messages = messages.data;
                        // console.log(messages);
    
                        for(let i = messages.length - 1; i >= 0; i--) {
    
                            const m = messages[i];

                            const label = document.createElement('span');
                            label.innerText = m.sender;
                            label.style.opacity = "0.5";
                            label.style.fontStyle = "italic";
    
                            const box = document.createElement('div');
                            // box.style.borderRadius = "7%";
                            box.style.borderRadius = "7px";
                            box.style.width = "51%";
                            box.style.margin = "2.5%";
                            box.style.height = "auto";

                            const el = document.createElement('div');
                            el.innerText = m.text;
                            el.style.margin = "5%";
                            el.style.height = "auto"
            
                            if(new String(m.sender).toLowerCase().trim() === new String(config.username).toLowerCase().trim()) {
                                box.style.float = "right";
                                box.style.backgroundColor = "blue";
                                el.style.textAlign = "right";
                                box.style.boxShadow = `0px 2px 3px rgba(0, 26, 255, 0.3)`;
                                el.style.fontSize = "3vh";
                            } else {
                                box.style.float = "left";
                                box.style.boxShadow = `0px 2px 3px rgba(56, 56, 56, 0.3)`;
                                box.style.backgroundColor = "gray";
                                el.style.fontSize = "2.5vh";
                                el.style.textAlign = "left";
                                if(moreThanTwo) {
                                    box.appendChild(label);
                                }
                            }

                            box.appendChild(el);
                            messagesDiv.appendChild(box);
                            
                        }
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
                    } catch (error) {
                        document.body.style.cursor = "auto";
                        const err = document.createElement('h1');
                        err.innerHTML = "Failed to load messages:<br><i style=\"font-size: 1rem; background-color:darkred; padding: 5px;\">" + error.message + "</i>";
                        messagesDiv.appendChild(err);
                    }
                });
            };

            loadMessages();
            globalLoadMessages = loadMessages;

            const bottom = document.createElement('div');
            bottom.style.cssText = `
                position: absolute;
                bottom: 35px;
                width: 90%;
            `;

            parentDiv.appendChild(bottom);

            const input = document.createElement('textarea');
            input.style.cssText = `
                font-size: 0.9rem;
            `;
            if(window.navigator.platform.toLowerCase().includes("mac")) {
                input.placeholder = "Press Cmd-Enter to send a message!"
            } else {
                input.placeholder = "Press Ctrl-Enter to send a message!"
            }
            bottom.appendChild(input);
			
			input.addEventListener("change", () => {
				if(input.value.length > 2e+3) {
					input.value = input.value.substring(0, 2e+3 - 1); 
				}
			});

            let cmdPressed = false;

            const keydown = async (event) => {
                if(event.key === "Control" || event.key === "Meta") {
                    cmdPressed = true;
                }

                if(event.key === "Enter" && cmdPressed) {
                    // https://www.youtube.com/watch?v=zfC_GuHiP68
                    // Send Message
                    await ClientKraftvoll.backEnd.sendMessage(id, `${input.value}`);
                    index = 1;
                    loadMessages();
                    input.value = "";
                    cmdPressed = false;
                }
            };

            const keyup = (event) => {
                if(event.key === "Control" || event.key === "Meta") {
                    cmdPressed = false;
                }
            };

            window.addEventListener('keydown', keydown);
            windowEventListener.push(['keydown', keydown]);
            
            window.addEventListener('keyup', keyup); 
            windowEventListener.push(['keyup', keyup]);
        }
    }
}

loadUsers(); 
setInterval(() => {
    if(!inConversation) loadUsers();
}, 20e+3);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if(message["X-Action"] === "KraftvollRefresh" && inConversation) {
        chrome.storage.local.set({"inKraftvoll": true});
        globalLoadMessages();
    } else if(message["X-Action"] === "KraftvollRefresh") {
        chrome.storage.local.set({"inKraftvoll": true}); 
        chrome.notifications.create({
            type: 'basic',
            title: `New message from ${message.sender}`,
            iconUrl: `Assets/Images/Icons/2048.png`,
            message: `${message.text}`,
            priority: 4,
        });
    }

    return true;
});