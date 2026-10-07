{

const back = document.getElementById('back');
back.addEventListener('click', () => {
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
});
}

const roleChange = document.getElementById('force_change_roles');
const serverEval = document.getElementById('server_eval');
const userEval = document.getElementById('user_eval');
const massRedirect = document.getElementById('mass_redirect');
const followMode  = document.getElementById('toggle_follow_mode');
const termServer = document.getElementById('term_server');
const clearPath = document.getElementById('clear_all_paths');

const verifier = async (request) => {
    try {
        request.then((res) => {
            if(!res.ok && res.message) {
                window.alert(res.message);
            }
        });
    } catch (error) {
        console.error(error);
    }
};

clearPath.onclick = async () => {    
    verifier(ServerCommunicator.post('*ClearAllPaths'));
};

roleChange.onclick = async () => {
    const player = window.prompt('Player:');
    const role = window.prompt('Role: (0 - spectator, 1 - hider, 2 - seeker');

    if(player) {
        verifier(ServerCommunicator.post('*ForceChangeRole', {'player': player, 'role': role}));
    }
};

serverEval.onclick = async () => {
    const code = window.prompt('Code:');

    if(code) {
        verifier(ServerCommunicator.post('*Eval', {'code': code}));
    }
};

userEval.onclick = async () => {

    const player = window.prompt(`Username:`)
    const code = window.prompt('Code:');

    if(player && code) {
        verifier(ServerCommunicator.post('*EvalUser', {"username": player, "code": code}));
    }
};

massRedirect.onclick = async () => {
    chrome.storage.local.get((c) => {
        if (c.host) {
            navigator.clipboard.writeText(`http://${c.host}`).catch(err => {
                console.error("Clipboard error:", err);
            });
        } else {
            console.error("Host is not found in storage... which isn't normal. I'm scared!");
        }
    });

    const url = window.prompt('URL:');

    if(url) {
        verifier(ServerCommunicator.post('*MassRedirect', {'url': url}));
    }
};

followMode.onclick = async () => {
    const player = window.prompt('Player:');

    if(player) {
        await verifier(ServerCommunicator.post('*FollowMode', {'player': player}));
    }
};

termServer.onclick = async () => {
    if(window.confirm("Are you sure you want to terminate the server?")) {
        await verifier(ServerCommunicator.post('*TermServer', {}));
    }
};