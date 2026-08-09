window.HIGH_ASSET_COUNT = 25;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomizeSubArray(arr, start, n) {
    const end = Math.min(start + n, arr.length);

    for (let i = end - 1; i > start; i--) {
        const j = start + Math.floor(Math.random() * (i - start + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function rng(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let notificationOffset = 0;
const startTop = 15;
const spacing = 20

function epochToDate(epoch) {
    const date = new Date(epoch); // milliseconds
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}


function sendNotification(message, timeMs) {
    const noScreenEffects = localStorage.getItem("removeScreenEffects") == "true";

    const div = document.createElement('div');
    div.className = "notification";
    if(!noScreenEffects)
        div.style.opacity = 0.0;
    div.innerHTML = message;
    div.style.top = `${startTop + notificationOffset}px`;

    

    // if(currentNotifications > 1) 
    //     div.style.top = `${currentNotifications * 6}%`;
    // currentNotifications++;
    
    const show = setTimeout(() => {
        if(!noScreenEffects)
            div.style.opacity = 0.93;
        // div.style.width = "80vw";
    }, 50);
    
    
    const hide = setTimeout(() => {
        notificationOffset -= (div.offsetHeight + spacing);
        if(!noScreenEffects) {
            div.style.maxHeight = "3vh";
            div.style.width = "0vw";
            div.style.opacity = 0.0;
        }
        // currentNotifications--;
    }, timeMs);
    
    const remove = setTimeout(() => {
        // notificationOffset -= (div.offsetHeight + 20);
        div.remove();
    }, timeMs + 250);
    
    div.onclick = () => {
        clearTimeout(show);
        clearTimeout(remove);
        clearTimeout(hide);

        notificationOffset -= (div.offsetHeight + spacing);
        if(!noScreenEffects) {
            div.style.top = `${-1 * (notificationOffset + div.offsetHeight + 30)}px`;
            setTimeout(() => {
                div.remove()
            }, 2000);
        } else {

            div.remove()
        }
    };

    document.body.appendChild(div);
    notificationOffset += div.offsetHeight + spacing;
}

function createPopup(content, widthStr = undefined, heightStr = undefined) {

    const div = document.createElement('div');
    div.className = "pop_up";
    div.innerHTML = content;
    
    if(widthStr) {
        div.style.width = widthStr
    }
    if(heightStr) {
        div.style.height = heightStr;
        div.style.maxHeight = heightStr;
    }

    return div;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function resetToDefault() {
    const setup = {
        disableSetAssets: false,
        motionControls: true,
        tts: true,
        cardFlip: false,
        
        autoScroll: {
            enabled: false,
            time: 10   
        },

        // speedrunStudy: false,

        answerSorting: true,
        shuffledCards: true,
        segmentedStudying: {
            enabled: false,
            count: 5,
            repeatChance: 25,
            percentRequiredToProceed: 100,
            requiredPerfections: 3,
            // shuffleSegment: true,
        }
    };
    localStorage.setItem("globalSettings", JSON.stringify(setup))
}

if(!localStorage.getItem("globalSettings"))
    resetToDefault();

function insertHtmlAtRange(range, html) {
    if (!range) return;

    // Work on a clone so the caller's copy isn't modified
    range = range.cloneRange();

    // Remove selected content
    range.deleteContents();

    // Create fragment from HTML
    const fragment = range.createContextualFragment(html);

    // Keep track of the last inserted node
    const lastNode = fragment.lastChild;

    // Insert HTML
    range.insertNode(fragment);

    // Restore the cursor after the inserted content
    if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

async function createPngBlobFromImage(file) {
    // Ensure it's an image
    if(!file.type.startsWith("image/")) {
        return null;
    }

    // Load the image
    const bitmap = await createImageBitmap(file);

    // Draw it to a canvas
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    // Convert to PNG Blob
    const pngBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
    );

    return pngBlob;
}

function createPopup(content, widthStr = undefined, heightStr = undefined) {
    const div = document.createElement('div');
    div.className = "pop_up";
    div.innerHTML = content;
    
    if(widthStr) {
        div.style.width = widthStr
    }
    if(heightStr) {
        div.style.height = heightStr;
        div.style.maxHeight = heightStr;
    }

    return div;
} 

function renameFile(file, newBaseName) {
    const ext = file.name.includes(".")
        ? file.name.slice(file.name.lastIndexOf("."))
        : "";

    return new File([file], `${newBaseName}${ext}`, {
        type: file.type,
        lastModified: file.lastModified
    });
}

let emergencyTimeout = null;
function callLoad(timeout = 10e+3) {
    clearTimeout(emergencyTimeout);
    emergencyTimeout = null;

    const el = document.createElement('div');
    el.className = "loader";
    el.style.opacity = 0;
    requestAnimationFrame(() => {
        el.style.opacity = 1;
    });

    document.body.append(el);
    setTimeout(() => {
        endLoad();
    }, timeout);
}

function endLoad() {
    clearTimeout(emergencyTimeout);
    emergencyTimeout = null;

    document.querySelectorAll('.loader').forEach((el) => {
        requestAnimationFrame(() => {
            el.style.opacity = 0;
        });

        setTimeout(() => {
            el.remove();
        }, 500);
    });
}

class CoreNote {
    static lock = false;
    
    
    static prompt(text, def = "") {
        // THIS SHOULDN'T HAPPEN, but just in case...
        if(CoreNote.lock) {
            console.error("Failed to acquire the alert/prompt/confirm lock");
            new Promise((resolve) => {
                resolve(window.prompt(text, def))
            });
        }

        CoreNote.lock = true;

        return new Promise((resolve, reject) => {
            try {
                const overlay = document.createElement('div');
                overlay.className = "alert_overlay";
                overlay.style.opacity = 0;

                if(document.querySelector('.loader')) {
                    overlay.style.backgroundColor = 'black';
                }
        
                overlay.innerHTML = `
                    <div class="alert_overlay">
                        <div class="alert_box">
                                <p>${text}</p>
                                <textarea></textarea> <br>
                                <button>OK</button>
                        </div>
                    </div>
                
                `;
        
                document.body.appendChild(overlay);
                setTimeout(() => {
                    overlay.style.opacity = 1;
                }, 50);

                // document.querySelector(".alert_overlay").querySelector('textarea')

                overlay.querySelector('textarea').value = def;
                overlay.querySelector('textarea').scroll();
                setTimeout(() => {
                    overlay.querySelector('textarea').focus();
                }, 300);
        
                overlay.querySelector('button').onclick = () => {
                    overlay.style.opacity = 0;
                    setTimeout(() => {
                        overlay.remove();
                    }, 1000);
                    CoreNote.lock = false;

                    resolve(overlay.querySelector('textarea').value);
                    return;
                }
            } catch (err) {
                reject(err);
                console.error(err);
                CoreNote.lock = false;
            }
        });

    }

    static alert(text) {
        // THIS SHOULDN'T HAPPEN, but just in case...
        if(CoreNote.lock) {
            console.error("Failed to acquire the alert/prompt/confirm lock");
            window.alert(text);
            return;
        }

        CoreNote.lock = true;

        try {
            const overlay = document.createElement('div');
            overlay.className = "alert_overlay";
            overlay.style.opacity = 0;
    
            if(document.querySelector('.loader')) {
                overlay.style.backgroundColor = 'black';
            }

            overlay.innerHTML = `
                <div class="alert_overlay">
                    <div class="alert_box">
                            <p>${text}</p>
                            <button>OK</button>
                    </div>
                </div>
            
            `;
    
            document.body.appendChild(overlay);
            setTimeout(() => {
                overlay.style.opacity = 1;
            }, 50);
    
            overlay.querySelector('button').onclick = () => {
                overlay.style.opacity = 0;
                setTimeout(() => {
                    overlay.remove();
                }, 1000);
                CoreNote.lock = false;
            }
        } catch (err) {
            console.error(err);
            CoreNote.lock = false;
        }

    }
    
    static confirm(text) {
        // THIS SHOULDN'T HAPPEN, but just in case...
        if(CoreNote.lock) {
            console.error("Failed to acquire the alert/prompt/confirm lock");
            new Promise((resolve) => {
                resolve(window.confirm(text))
            });
            return;
        }

        CoreNote.lock = true;

        return new Promise((resolve, reject) => {
            try {
                const overlay = document.createElement('div');
                overlay.className = "alert_overlay";
                overlay.style.opacity = 0;

                if(document.querySelector('.loader')) {
                    overlay.style.backgroundColor = 'black';
                }
        
                overlay.innerHTML = `
                    <div class="alert_overlay">
                        <div class="alert_box">
                                <p>${text}</p>
                                <button class="no">No</button>
                                <button class="yes">Yes</button>
                        </div>
                    </div>
                
                `;
        
                document.body.appendChild(overlay);
                setTimeout(() => {
                    overlay.style.opacity = 1;
                }, 50);
    

                overlay.querySelectorAll('button').forEach((el) => {
                    el.onclick = () => {
                        overlay.style.opacity = 0;
                        setTimeout(() => {
                            overlay.remove();
                        }, 1000);
                        CoreNote.lock = false;

                        resolve(el.className == "yes");
                    };
                });
            } catch (err) {
                console.error(err);
                CoreNote.lock = false;
            }
        });

        
    }
    
    static killOverlay() {
        CoreNote.lock = false;
        document.querySelectorAll('.alert_overlay').forEach((overlay) => {
            overlay.style.opacity = 0;
            setTimeout(() => {
                overlay.remove();
            }, 1000);
        });
    }
}