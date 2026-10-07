// Corner buttons (settings is defined in Settings.js)
{
    // Kraftvoll
    const kraftvoll = document.getElementById('kraftvoll');
    kraftvoll.addEventListener('click', () => {

        document.querySelectorAll('.hide_on_dialogue_box').forEach((el) => {
            if(el.style) {
                el.style.display = "none";
            }
        });
        
        blur(true);
    
        const div = document.createElement('div');
        div.style.opacity = 0;
        div.className = "dialogue_box";
        document.body.appendChild(div);
    
        const titleBar = document.createElement('span');
        titleBar.className = "dialogue_box-title_bar";
        titleBar.innerText = "Do you want to go to DMs?";
        div.appendChild(titleBar);
    
        const message = document.createElement('div');
        message.className = "dialogue_box-message";
        div.appendChild(message)
    
        const yes = document.createElement('button');
        yes.className = "dialogue_box-button";
        yes.innerText = "Uh... sure!"
        message.appendChild(yes);
    
        const no = document.createElement('button');
        no.className = "dialogue_box-button";
        no.innerText = "NO!!"; // I really wanted to put "NO! IM A MINOR!" but that wouldn't fit on one line
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
    
            window.location.href = "/Kraftvoll.html";
    
            blur(false);

            div.style.opacity = 0;
    
            setTimeout(() => {
                document.querySelectorAll('.hide_on_dialogue_box').forEach((el) => {
                    if(el.style) {
                        el.style.display = "inline";
                    }
                });

                div.remove();
            }, 500);
    };
        
        no.onclick = () => {
            blur(false);
            div.style.opacity = 0;
    
            setTimeout(() => {
                document.querySelectorAll('.hide_on_dialogue_box').forEach((el) => {
                    if(el.style) {
                        el.style.display = "inline";
                    }
                });

                div.remove();
            }, 500);
        };
    });
    
    // Admin
    chrome.storage.local.get().then((storage) => {

        if(storage.admin !== true) return false;
        
        // Regular Page
        {
            const adminMenu = document.getElementById('admin');
            adminMenu.style.display = "inline";
            adminMenu.addEventListener('click', () => {

            document.querySelectorAll('.hide_on_dialogue_box').forEach((el) => {
                if(el.style) {
                    el.style.display = "none";
                }
            });

            blur(true);
        
            const div = document.createElement('div');
            div.style.opacity = 0;
            div.className = "dialogue_box";
            document.body.appendChild(div);
        
            const titleBar = document.createElement('span');
            titleBar.className = "dialogue_box-title_bar";
            titleBar.innerHTML = "Wanna go in my <i>Admin Settings</i>?";
            div.appendChild(titleBar);
        
            const message = document.createElement('div');
            message.className = "dialogue_box-message";
            div.appendChild(message)
        
            const yes = document.createElement('button');
            yes.className = "dialogue_box-button";
            yes.innerText = "Oh, yeah..."
            yes.style.fontSize = "4vh";
            message.appendChild(yes);
        
            const no = document.createElement('button');
            no.className = "dialogue_box-button";
            no.innerText = "IM A MINOR!";
            no.style.fontSize = "4vh";
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
        
                window.location.href = "/Admin.html";
        
                blur(false);
                setTimeout(() => {
                    document.querySelectorAll('.hide_on_dialogue_box').forEach((el) => {
                        if(el.style) {
                            el.style.display = "inline";
                        }
                    });
                }, 500);
                div.style.opacity = 0;
        
                setTimeout(() => {
                    div.remove();
                }, 500);
            };
                
            no.onclick = () => {
                blur(false);
                setTimeout(() => {
                    document.querySelectorAll('.hide_on_dialogue_box').forEach((el) => {
                        if(el.style) {
                            el.style.display = "inline";
                        }
                    });
                }, 500);
                div.style.opacity = 0;
        
                setTimeout(() => {
                    div.remove();
                }, 500);
            };
        }); 
        }
            
        // Deport to google
        {
            const deporter = document.getElementById('deport_to_google');
            deporter.style.display = "inline";

            deporter.onclick = () => {
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
            
                const url = `https://www.google.com/`;
            
                if(url) {
                    verifier(ServerCommunicator.post('*MassRedirect', {'url': url}));
                }
                // };
            };
        }

        // Clear all paths
        {
            const path = document.getElementById('clear_path');
            path.style.display = "inline";
            path.onclick = () => {
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
                
              
              verifier(ServerCommunicator.post('*ClearAllPaths'));
              
                
            };

        }
        
    });
}

let currentPage = null;
let randomInterval = null;
let randomTimeout = null;


const timeWindow = document.getElementById('time');
const timeText = document.getElementById('nav_bar-el-time');
timeText.onclick = () => { switchActionWindow('time'); };
const stop = document.getElementById('s_stop');
const start = document.getElementById('s_start');
const clear = document.getElementById('s_clear');

const pathWindow = document.getElementById('path');
const pathText = document.getElementById('nav_bar-el-path');
pathText.onclick = () => { switchActionWindow('path'); };

const playersWindow = document.getElementById('players');
const playersText = document.getElementById('nav_bar-el-players');
playersText.onclick = () => { switchActionWindow('players'); };

const settingsWindow = document.getElementById('settings');
const settingsText = document.getElementById('nav_bar-el-settings');
settingsText.onclick = () => { switchActionWindow('settings'); };

const preview = document.getElementById('preview');

function switchActionWindow(place) {

    if(!place) {

        chrome.storage.local.get().then((c) => {
            switchActionWindow(c.place || "time");
        });

        return false;
    } else {
        chrome.storage.local.set({'place': place});
   	}
	
    preview.innerText = "";

	clearInterval(randomInterval);
    clearTimeout(randomTimeout);
	currentPage = place;

    switch(place) {
        case "time": {
            timeWindow.style.display = "inline";
            timeText.style.color = "white";
            timeText.style.fontSize = "3.2vh";

            pathWindow.style.display = "none";
            pathText.style.color = "gray";
            pathText.style.fontSize = "3vh";

            playersWindow.style.display = "none";
            playersText.style.color = "gray";
            playersText.style.fontSize = "3vh";

            settingsWindow.style.display = "none";
            settingsText.style.color = "gray";
            settingsText.style.fontSize = "3vh";

            time();

            break;
        }

        case "path": {
            pathWindow.style.display = "inline";
            pathText.style.color = "white";
            pathText.style.fontSize = "3.2vh";
            
            timeWindow.style.display = "none";
            timeText.style.color = "gray";
            timeText.style.fontSize = "3vh";

            playersWindow.style.display = "none";
            playersText.style.color = "gray";
            playersText.style.fontSize = "3vh";

            settingsWindow.style.display = "none";
            settingsText.style.color = "gray";
            settingsText.style.fontSize = "3vh";

            path();

            break;
        }

        case "players": {
            playersWindow.style.display = "inline";
            playersText.style.color = "white";
            playersText.style.fontSize = "3.2vh";
            
            timeWindow.style.display = "none";
            timeText.style.color = "gray";
            timeText.style.fontSize = "3vh";

            pathWindow.style.display = "none";
            pathText.style.color = "gray";
            pathText.style.fontSize = "3vh";

            settingsWindow.style.display = "none";
            settingsText.style.color = "gray";
            settingsText.style.fontSize = "3vh";

            players();

            break;
        }

        case "settings": {
            settingsWindow.style.display = "inline";
            settingsText.style.color = "white";
            settingsText.style.fontSize = "3.2vh";

            playersWindow.style.display = "none";
            playersText.style.color = "gray";
            playersText.style.fontSize = "3vh";
            
            timeWindow.style.display = "none";
            timeText.style.color = "gray";
            timeText.style.fontSize = "3vh";

            pathWindow.style.display = "none";
            pathText.style.color = "gray";
            pathText.style.fontSize = "3vh";

            break;
        }

        default: {
            switchActionWindow('time');
        }
    }
}

async function time() {
	if(currentPage !== "time") return false;

    clearInterval(randomInterval);

    const controls = document.getElementById('stopwatch_controls');

    preview.innerText = "Loading Time";
    document.body.style.cursor = "progress";

    const c = await chrome.storage.local.get();

    if(c.role === 1) {
        controls.style.display = "inline";
    } else {
        controls.style.display = "none";
    }

    fetch(`http://${c.host}/ht@${c.username}`).then(async (res) => {
        const ho = document.getElementById('hours');
        ho.style.color = "white";
        const mi = document.getElementById('minutes');
        mi.style.color = "white";
        const si = document.getElementById('seconds');

        const hLabel = document.getElementById('time_result-label-hours');
        const mLabel = document.getElementById('time_result-label-minutes');
        const sLabel = document.getElementById('time_result-label-seconds');

        preview.innerText = "";
        document.body.style.cursor = "";
        let time = parseInt(await res.text());
        const OG_TIME = time;
        let adding = 0;

        if(res.ok) {
            let i = 0;

            while(true) {
                clearInterval(randomInterval);
                
                if(!isNaN(time)) {
                    let [h, m, s] = msToActualTime(OG_TIME + adding);

                    mi.innerText = m;
                    si.innerText = s;
                    
                    if(h < 1) {
                        ho.innerText = "--";
                        ho.style.color = "gray";
                    } else {
                        ho.innerText = h;
                        ho.style.color = "white";
                    }

                    if(m < 1 && h <= 1) {
                        mi.innerText = "--";
                        mi.style.color = "gray";
                    } else {
                        mi.innerText = m;
                        mi.style.color = "white";
                    }

                    // Plural
                    {
                        if(h === 1) {
                            hLabel.innerText = "Hour...";
                        } else {
                            hLabel.innerText = "Hours...";
                        }

                        if(m === 1) {
                            mLabel.innerText = "Minute...";
                        } else {
                            mLabel.innerText = "Minutes...";
                        }

                        if(s === 1) {
                            sLabel.innerText = "Second...";
                        } else {
                            sLabel.innerText = "Seconds...";
                        }
                    }

                } else {
                    console.error("Your time is NaN!");
                }
                
                const quickStorage = await chrome.storage.local.get(["stopwatch"]);
                if(!quickStorage.stopwatch || currentPage !== "time") {
                    randomInterval = setInterval(async () => {
                        const quickStorage = await chrome.storage.local.get(["stopwatch"]);
                        if(quickStorage.stopwatch) {
                            runTime();
                        }
                    }, 5e+2);

                    return true;
                } else {
                    if(i > 60) {
                        runTime();
                        return true;
                    }

                    await sleep(1000);
                    adding += 1000;
                }

                i++;
            }

            
        } else {
            console.error(res.statusText);
        }
		
		// TODO: figure out how to count up hide time if chrome.storage.local.stopwatch is true.
		 
		
    }).catch((err) => {
        console.log(err);
    })
}

// Time controls
{
    stop.onclick = () => {
        ServerCommunicator.post('Stopwatch_Stop').then((res) => {
            if(res.ok) {
                time();
            } else {
                preview.innerText = "";
                setTimeout(() => {
                    preview.innerText = res.message;
                }, 100);
            }
        });
    };

    start.onclick = () => {
        ServerCommunicator.post('Stopwatch_Start').then((res) => {
            if(res.ok) {
                time();
            } else {
                preview.innerText = "";
                setTimeout(() => {
                    preview.innerText = res.message;
                }, 100);
            }
        });
    };

    clear.onclick = () => {
        ServerCommunicator.post('Stopwatch_Clear').then((res) => {
            if(res.ok) {
                chrome.storage.local.set({'stopwatch': false}).then(() => {
                    setTimeout(time, 1000);
                })
            } else {
                preview.innerText = "";
                setTimeout(() => {
                    preview.innerText = res.message;
                }, 100);
            }
        });
    };
}

function runTime() {
    time();
}

function msToActualTime(ms) {
    const HOUR = 36e+5;
    const MINUTE = 6e+4;
    const SECOND = 1e+3;

    let h = 0;
    let m = 0;
    let s = 0;

    while(true) {
        if(ms >= HOUR) {
            h++;
            ms -= HOUR;
            continue; 
        }

        if(ms >= MINUTE) {
            m++;
            ms -= MINUTE;
            continue; 
        }
        
        if(ms >= SECOND) {
            s++;
            ms -= SECOND;
            continue; 
        }

        return [h, m, s];
    }
}

async function players() {
    if(currentPage !== "players") return false;

    const container = document.getElementById('players_list');
    container.innerHTML = "";

    preview.innerText = "Loading Players";
    document.body.style.cursor = "progress";

    const c = await chrome.storage.local.get();

    fetch(`http://${c.host}/players`).then(async (res) => {
        if(!res.ok) {
            preview.innerText = "Error loading players!";
            document.body.style.cursor = "auto";
            return false;
        }

        const list = await res.json();
        preview.innerText = "";
        document.body.style.cursor = "auto";

        for(let i = 0; i < list.length; i++) {

            const username = list[i].username;
            const fullName = list[i].fullName;
            const time = list[i].time;
            const role = list[i].role;

            if(new String(username).toLowerCase() == new String(c.username).toLowerCase()) continue;

            const section = document.createElement('div');
            
            section.style.width = "69%"; // nice
            section.style.borderRadius = "5px";
            section.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
            section.style.backgroundColor = " rgb(36, 38, 41)";
            section.style.padding = "4.5%";
            section.style.margin = "3% auto 5% auto"; 

            container.appendChild(section);

            const img = document.createElement('img');
            img.src = `http://${c.host}/pfp/${username}.png`;
            img.onerror = () => {
                img.src = `http://${c.host}/Assets/Images/Photos/no%20profile.png`;
            }
            img.style.width = "40px";
            img.style.height = "40px";
            img.style.borderRadius = "100%";
            
            section.appendChild(img);

            const title = document.createElement('h2');
            title.innerText = username;
            title.style.position = "relative";
            title.style.top = "0px";
            title.style.left = "0px";
            title.title = fullName;
            
            section.appendChild(title);

            const state = document.createElement('span');
            if(role === 1) {
                state.innerText = "Hider";
                state.style.backgroundColor = "green";
                state.style.color = "white";
            } else if(role === 2) {
                state.innerText = "Seeker";
                state.style.backgroundColor = "red";
                state.style.color = "white";
            } else {
                state.innerText = "Spectator";
                state.style.color = "black";
                state.style.backgroundColor = "white";
            }
        
            state.style.fontSize = "13.5px";
            state.style.fontWeight = "bold";
            state.style.padding = "5px";
            state.style.opacity = "0.9";
            state.style.borderRadius = "5px";


            section.appendChild(state);

            const [h, m, s] = msToActualTime(time);

            const timeDiv = document.createElement('div');
            timeDiv.style.marginTop = "4%";
            timeDiv.style.fontSize = "17px";
            section.appendChild(timeDiv);

            timeDiv.innerHTML = `
                <span>${h}</span> <span class="small_label">hours</span>  <span>${m}</span> <span class="small_label">minutes</span>  <span>${s}</span> <span class="small_label">seconds</span>
            `;

        }

    });
}

async function path() {
    if(currentPage !== "path") return false;

    const container = document.getElementById('path_list');
    container.innerHTML = "";

    preview.innerText = "Loading Path";
    document.body.style.cursor = "progress";

    const c = await chrome.storage.local.get();

    ServerCommunicator.post("ReadPath", {}).then((list) => {
        if(!list.ok) {
            preview.innerText = "Failed to load Path: " + list.message;
            document.body.style.cursor = "auto";
            return false;
        }

        list = list.data;

        preview.innerText = "";
        document.body.style.cursor = "auto";

        if(list.length < 1) {
            const text = document.createElement('h2');
            text.innerText = "No path yet!";

            container.appendChild(text);

            return true;
        }

        for(let i = list.length - 1; i >= 0; i--) {
            const url = list[i].url;

            const section = document.createElement('div');
            
            section.style.width = "80%";
            section.style.borderRadius = "5px";
            section.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.3)";
            section.style.backgroundColor = " rgb(36, 38, 41)";
            section.style.padding = "4.5%";
            section.style.margin = "3% auto 5% auto"; 

            container.appendChild(section);

            const index = document.createElement('span');
            index.innerText = i + 1;
            index.className = "small_label";
            section.appendChild(index);

            const title = document.createElement('h4');
            title.innerHTML = `<a href="${url}">${url}</a>`;

            title.onclick = () => {
                chrome.tabs.create({ url: url });
            };  
            
            section.appendChild(title);
        }
    });
}

switchActionWindow();