// Refreshes per page load / refresh
// Manages DOM
// Can use chrome.runtime.sendMessage for communication to the background script

const element = document.createElement('div');
element.style.width = `${document.documentElement.scrollWidth}px`;
element.style.height = `${document.documentElement.scrollHeight}px`;
element.style.position = "fixed";
element.style.zIndex = "999999999999";
element.style.pointerEvents = "none";

function updateDimensions() {
    const pageWidth = document.documentElement.scrollWidth;
    const pageHeight = document.documentElement.scrollHeight;
    element.style.width = `${pageWidth}px`;
    element.style.height = `${pageHeight}px`;
}

window.addEventListener("resize", updateDimensions);

let vignetteInterval = null;
let vignetteTimeout = null;

function addVignetteById(id) {
    switch(id) {

        // Handle Damage

        case "shot": {
            addVignette("rgba(0, 52, 73, 0.5)", "80px", 250, 500, 175);
            break;
        }

        case "dead": {
            addVignette("rgba(0, 0, 0, 0.57)", "80px", 250);
            break;
        }

        case "quick_draw": {
            addVignette("rgba(170, 237, 13, 0.5)", "80px", 250, 500, 175);
            break;
        }

        case "draw": {
            addVignette("rgba(127, 176, 11, 0.2)", "60px", 250, 500, 175);
            break;
        }

        case "kill": {
            addVignette("rgba(255, 255, 255, 0.57)", "50px", 250, 500, 175);
            break;
        }

        case "hit": {
            addVignette("#962929", "50px", 250, 500, 175);
            break;
        }

        case "success": {
            addVignette("rgb(94, 255, 0)", "50px", 250, 500, 175);
            break;
        }

        case "bomb": {
            addVignette("rgb(255, 255, 255)", "300px", 500, 1000, 420);
            break;
        }

        // Full Health
        case "3": {
            removeVignette();
            break;
        }

        // 3/4 health
        case "2": {
            addVignette("rgba(150, 41, 41, 0.5)", "110px", 2000, undefined, 2000, 800);
            break;
        }

        // Half Health
        case "1": {
            addVignette("rgba(150, 41, 41, 0.75)", "135px", 2000, undefined, 2000, 800);
            break;
        }

        // Quarter left
        case "0": {
            addVignette("#962929", "160px", 600, undefined, 600, 250);
            break;
        }
    }
}

function removeVignette() {
    try {
        clearInterval(vignetteInterval);
        clearTimeout(vignetteTimeout);
        document.body.removeChild(element);
        element.style.transition = ``;
    } catch (error) {
        // There probalby isnt even a vignette
    }
}
    
function addVignette(color = "#000", thickness = "100px", fadeIn = 500, removalTime = -1, pulsatingInterval = -1, pulsatingBreak = -1) {
    // Remove existing vignette if any
    removeVignette();

    // Use the globally declared `element`
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.transition = `box-shadow ${fadeIn}ms ease`;
    element.style.boxShadow = `inset 0 0 0px ${color}`; // Start with no shadow

    // Add to DOM
    document.body.insertBefore(element, document.body.firstChild);

    // Fade-in effect
    if (fadeIn > 0) {
        setTimeout(() => {
            element.style.boxShadow = `inset 0 0 ${thickness} ${color}`;
        }, 50);
    } else {
        element.style.boxShadow = `inset 0 0 ${thickness} ${color}`;
    }

    // Pulsating effect
    if (pulsatingInterval > 0) {
        let firstTime = true;
        let state = true;
        
            vignetteInterval = setInterval(() => {
                element.style.boxShadow = state
                    ? `inset 0 0 ${thickness} ${color}`
                    : `inset 0 0 0px ${color}`;
                state = !state;
            }, pulsatingInterval + pulsatingBreak);
    }

    // Auto-remove after specified time
    if (removalTime > 0) {
        vignetteTimeout = setTimeout(() => {
            removeVignette();
        }, removalTime);
    }
}

function sendMessage(xAction = "fetch", content = {}) {
	try {
		// const id = crypto.randomUUID().replaceAll('-','');
		const id = Date.now();
		
		content.id = id;
		content.sender = "content";
		content["X-Action"] = xAction;
	
		chrome.runtime.sendMessage(content);
	} catch (error) {
		console.error(error);
	}
}

function sendMessageAndWaitForResponse(xAction, content, cb) {
    // Send the message
    sendMessage(xAction, content);

    // Listen for the response
    chrome.runtime.onMessage.addListener(function listener(message, sender, sendResponse) {
        // Check if the message contains the expected action
        if (message["X-Action"] === xAction) {
            // Call the callback with the received response
            cb(message);

            // Remove the listener after handling the response to prevent memory leaks
            chrome.runtime.onMessage.removeListener(listener);
        }
    });
}

// Location
{
	sendMessage('badge', {"amount": 0});

	const url = window.location.href;
	
	// Due to fucking mixed content restrictions (http/https), we can't just fetch directly... but we actually can. Background scripts (for some fucking reason) have no such limitations. 
	sendMessage("fetch", {
		"head": { // The head automatically adds the authorization 'n' stuff like that
			"X-Action": "LocationUpdate"
		}, 
	
		"body": {
			"url": url
		}
	});
}

// Pubic Cursor 
{
	let processingFunc = false;
	let processingClickOrScroll = false;




	let firstTime = false;
	let previousPosition = null;

	const moveThreshold = 20; // Minimum movement in pixels to trigger sending a message

	const func = (event) => {
		if(processingFunc) return false;
		processingFunc = true

		const x = event.clientX;
		const y = event.clientY;

		// If it's the first time, initialize the previousPosition
		if (!firstTime) {
			firstTime = true;
			previousPosition = {
				"px": [x, y],
				"dc": [new Number(x / window.innerWidth).toFixed(4), y / new Number(window.innerHeight).toFixed(4)]
			};

			// Send initial message
			sendMessage("mouseCursor", {
				"px": [x, y],
				"dc": [x / window.innerWidth, y / window.innerHeight]
			});
		} else {
			// Calculate the distance between the current position and the previous position
			const distance = Math.sqrt(
				Math.pow(x - previousPosition.px[0], 2) + Math.pow(y - previousPosition.px[1], 2)
			);

			// Only send the message if the cursor has moved more than the threshold
			if (distance > moveThreshold) {
				sendMessage("mouseCursor", {
					"px": [x, y],
					"dc": [x / window.innerWidth, y / window.innerHeight]
				});

				// Update previousPosition to the current position
				previousPosition = {
					"px": [x, y],
					"dc": [x / window.innerWidth, y / window.innerHeight],
				};
			}
		}

		processingFunc = false;
	};

	const unclick = () => {
		if(processingClickOrScroll) return false;
		processingClickOrScroll = true
		sendMessage("mouseCursor", {
			"state": 0
		});
		processingClickOrScroll = false;
	};

	const click = () => {
		if(processingClickOrScroll) return false;
		processingClickOrScroll = true
		sendMessage("mouseCursor", {
			"state": -1
		});
		processingClickOrScroll = false;
	};

	
	document.addEventListener('mousedown', click);
	document.addEventListener('mouseup', unclick);

	document.addEventListener('scroll', click);
	document.addEventListener('scrollend', unclick);

	document.addEventListener('mousemove', func);
	
	document.querySelectorAll('iframe').forEach((iframe) => {
		const doc = iframe.contentWindow.document;
	
		// Ensure the iframe document is fully loaded (to avoid weird shit which COULD happen)
		iframe.onload = () => {
			doc.addEventListener('mousemove', func);
			doc.addEventListener('mousedown', click);
			doc.addEventListener('mouseup', unclick);

			doc.addEventListener('scroll', click);
			doc.addEventListener('scrollend', unclick);
		};
	});
	

	setInterval(() => {
		document.removeEventListener('mousemove', func);
		document.addEventListener('mousemove', func);
	}, 10e+3);
}

function getRandomNumber(min, max) {
    try {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (e) {
        return -1;
    }
}

const boxOfMice = {
	// "username": timeout
};

function hexToRgb(hex) {
	const match = /^#([a-f0-9]{6})$/i.exec(hex);
	if (!match) return [0, 0, 0]; // default to black
	const rgb = [
	  parseInt(match[1].slice(0, 2), 16),
	  parseInt(match[1].slice(2, 4), 16),
	  parseInt(match[1].slice(4, 6), 16),
	];
	return rgb.join(',');
  }
  

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if(message.sender === "content") return false;

    switch(message["X-Action"].toLowerCase()) {
        case "cursor": {
			const data = message;

            const player = data.user;
			const x = data.x * 100;
			const y = data.y * 100;
			const state = data.state;
			const color = data.color;

			const id = `__${new String(player).toLowerCase().trim()}`;

			let el = null;                    
			if(!document.getElementById(id)) {
				el = document.createElement('div');
				el.className = "gchns_player_cursor_public";
				el.id = id;
				el.title = player;
				el.style.width = "60px";
				el.style.height = "60px";
				el.style.position = "fixed";
				el.style.backgroundColor = color || "red";
				el.style.transition = "all 0.3s ease";
				el.style.touchAction = "none";
				el.style.userSelect = "none";
				el.style.zIndex = "99999999";
				el.style.borderRadius = "100%";
				el.style.boxShadow = `6px 6px 20px rgba(${hexToRgb(color || "red")}, 0.25)`;
				el.style.borderColor = color || "red";
				el.style.borderWidth = "2px";
				el.style.cssText += `
					display: flex;
					justify-content: center; /* Centers horizontally */
					align-items: center;  `;

				document.body.appendChild(el);

				const length = document.querySelectorAll('.gchns_player_cursor_public').length;
				sendMessage('badge', {"amount": length});

				chrome.storage.local.get().then((c) => {
					if(!c.host) return;

					sendMessageAndWaitForResponse("fetchBase", {
						"url": `http://${c.host}/pfp/${player}.png`
					}, (res) => {
						const img = document.createElement('img');
						img.id = `${id}-img`
						img.src = `data:image/png;base64,${res.img}`;

						img.style.width = "50px";
						img.style.height = "50px";
						img.style.borderRadius = "100%";

						el.appendChild(img);
					});

				})
			} else {
				el = document.getElementById(id);
			}

			clearTimeout(boxOfMice[player]);
			el.style.transition = "all 0.3s ease";
			el.style.opacity = "1";

			boxOfMice[player] = setTimeout(() => {
				el.style.transition = "all 0.3s ease, opacity 1s ease";
				el.style.opacity = "0.3";
			}, 5e+3);

			el.style.backgroundColor = color || "red";
			el.style.boxShadow = `6px 6px 20px rgba(${hexToRgb(color || "red")}, 0.25)`;
			el.style.borderColor = color || "red";

			if(x) {
				el.style.left = `${x}%`;
			}

			if(y) {
				el.style.top = `${y}%`;
			}

			if(state === 0) {
				const icon = document.getElementById(`${id}-click`);
				if(icon) {
					icon.remove();
				}
				el.style.transform = "scale(1)";
			} else if(state === -1 && !document.getElementById(`${id}-click`)) {
				const tempEl = document.createElement('del');
				tempEl.id = `${id}-click`;

				el.style.transform = "scale(0.7)";
			}
			
            break;
        }

		case "playerleave": {
			
			const p = message.player;
			const potentialCursorEl = document.getElementById(`__${new String(p).toLowerCase().trim()}`);
			if(potentialCursorEl) {
				potentialCursorEl.style.transition = "all 0.3s ease, opacity 2s ease";
				potentialCursorEl.style.opacity = "0";
				setTimeout(() => {
					potentialCursorEl.remove();

					const length = document.querySelectorAll('.gchns_player_cursor_public').length;
					sendMessage('badge', {"amount": length});
				}, 2e+3);
			}

			break;
		}

		case "randomel": {
		
			
		
			const els = [...document.querySelectorAll('img')];
		
			// Check if any image exists
			if (els.length === 0) {
				console.log('No images found!');
				break;
			}
		
			const el = els[getRandomNumber(0, els.length - 1)];
		
			let computedStyle = window.getComputedStyle(el);
		
			// Convert width and height to numbers
			const canvas = document.createElement('canvas');
			canvas.width = parseInt(computedStyle.width, 10); // Ensure it's a number
			canvas.height = parseInt(computedStyle.height, 10);
		
			const ctx = canvas.getContext("2d");
		
			// Draw image on canvas
			ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
		
			// Convert to base64 image
			const base64 = canvas.toDataURL("image/png");
			const response = {
				data:   base64
			};
		
			// Send the response
			sendMessage('RandomEl', response);
		
			break;
		}

		case "profilepicturechange": {

			const player = message.user;

			const id = `__${new String(player).toLowerCase().trim()}-img`;
			
			const el = document.getElementById(id);

			if(el) {
				el.src = `data:image/png;base64,${message.img}`
			}

			break;
		}

		case "vignette": {

			const id = message.v_id;

			addVignetteById(id);

			break;
		}
		
		default: {
			if(message["X-Action"] === "fetchBase") break;

			console.log(`Unknown X-Action: ${message["X-Action"]}`);
			console.log(message);
			break;
		}
    }
    
    // Returning true keeps the message channel open for sendResponse
    return true;
});

