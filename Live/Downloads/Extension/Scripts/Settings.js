const previewS = document.getElementById('preview');
const changeColor = document.getElementById('s-color');
const pfp = document.getElementById('up_pfp');
const role = document.getElementById('role');
const rngTheme = document.getElementById('random_theme');
const customTheme = document.getElementById('custom_theme');
const srvDisconnect = document.getElementById('srv_disconnect');

// Color
{  
    chrome.storage.local.get(['host', 'username']).then((config) => {
        fetch(`http://${config.host}/color@${config.username}`).then(async (res) => {
            if(res.ok) {
                res = await res.text();
                changeColor.style.backgroundColor = res;
            }
        });
    
        changeColor.onchange = () => {
            changeColor.style.backgroundColor = changeColor.value;
            changeColor.style.boxShadow = `box-shadow: 0px 4px 6px ${changeColor.value}`;

            ServerCommunicator.post('ChangeColor', {data: changeColor.value})
        }
    });
}

// Profile Picture
{
    pfp.addEventListener('change', () => {
        const inputElement = pfp;

        // Get the selected file (if any)
        const selectedFile = inputElement.files[0];
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = async function(event) {
                // Assuming you have a function ServerCommunicator.post that can handle the request
                ServerCommunicator.post('ChangeProfilePicture', {
                    "picture": event.target.result // The Base64 string of the image
                })
            };

            reader.readAsDataURL(selectedFile); // Read the image file as a Base64 string
        }
    });

}

// Role
{
    const assignRole = (r) => {
        switch(r) {
            case 2:
                role.innerText = "You're a Seeker";
                role.internalData = 2;
            break;

            case 1:
                role.innerText = "You're a Hider";
                role.internalData = 1;
            break;

            default:
                role.innerText = "You're a Spectator";
                role.internalData = 0;
            break;
        }
    };

    const roleOnClick = () => { 
        let cr = role.internalData;
            cr++;
            if(cr > 2) cr = 0;

            role.style.filter = "brightness(30%)";
            role.onclick = null;

            ServerCommunicator.post('ChangeRole', {
                'role': cr
            }).then((res) => {
                role.style.filter = "";
                role.onclick = roleOnClick;

                if(res.ok) {
                    chrome.storage.local.set({role: cr});
                    assignRole(cr);
                } else {
                    window.alert(res.message);
                }
            });
    };

    chrome.storage.local.get().then((c) => {
        assignRole(c.role);
        
        role.onclick = roleOnClick;
    });
    
}

// Server Disconnect
{
    srvDisconnect.addEventListener('click', () => {
        resetClient();
    });
}

// Custom Theme
{
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

    customTheme.onclick = () => {
        verifier(ServerCommunicator.post("CustomTheme", {theme: window.prompt("Custom Theme:")}))
    };
}

// Random Theme
{
    rngTheme.onclick = () => {
        chrome.storage.local.get(['host', 'username']).then((config) => {
            fetch(`http://${config.host}/randomtheme`).then(async (res) => {
                if(res.ok) {
                    res = await res.text();
                    if(res && res != "null") {
                        rngTheme.innerText = res;
                    } else {
                        rngTheme.innerText = "Unknown Error";
                    }
                }
            });
        });
    }
}   