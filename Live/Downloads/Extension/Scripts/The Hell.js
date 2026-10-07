// <script src="/thehell.js"> // CONSOLE WARNING + RANDOM FUNCTIONS. SHOULD LOAD FIRST (BODY). </script>

let savingInProgress = false;

function loadingIcon(boolean, timeout = 1000) {
    if (document.getElementById("gif_loading_icon") && boolean === true) { // check for existing icon
        // console.error("LoadingIcon is already defined; thus, it exists, or is stuck.");
        return -1;
    }
    
    if(boolean) { // display loading icon
        const icon = document.createElement("img");
        icon.id = "gif_loading_icon";
        icon.src = "Assets/Images/Saving.gif";
        icon.ariaPlaceholder = "Loading Icon";
        icon.style.position = "fixed";
        icon.style.bottom = "3px";
        icon.style.right = "3px";
        icon.style.maxWidth = "80px";
        icon.style.height = "auto";
        icon.style.zIndex = "10000"
        icon.onclick = function () {
            loadingIcon(false);
        }

        document.body.appendChild(icon)
    } else { // remove loading icon
        setTimeout(() => { // wait a second, old man
            if (document.getElementById("gif_loading_icon")) { // check for existing icon
                document.getElementById("gif_loading_icon").remove();
            }
        }, timeout); 
    }
}

function theHell() {
    // NO LOGS WILL COME BEFORE THE HELL!
    console.clear();
    

    // console.error("Sending actual real-life porn can get your account banned.".toUpperCase() + " " + i);
    // console.log(console.log("%c _______ _    _ ______   _    _ ______ _      _     ___  _ \n |__   __| |  | |  ____| | |  | |  ____| |    | |   |__ \| |\n    | |  | |__| | |__    | |__| | |__  | |    | |      ) | |\n    | |  |  __  |  __|   |  __  |  __| | |    | |     / /| |\n    | |  | |  | | |____  | |  | | |____| |____| |____|_| |_|\n    |_|  |_|  |_|______| |_|  |_|______|______|______(_) (_)\n                                                            \n                       GET OUTTA MY CONSOLE! ", 'color: orange') + i);

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomNumber(min, max) {
    // try { 
        return Math.floor(Math.random() * (max - min + 1)) + min;
    // } catch (e) {
    //     return -1;
    // }
}

function getRandomDecimal(min = 0, max = 1) {
	return Math.random() * (max - min) + min;
}

function isNegative(number = 0) {
	if(isNaN(number)) {
		console.warn("func isNegative(num) recieved an invaid param (is NaN): " + number);
		return false;
	}
	
	if(number === 0) {
		return false;
	}
	
	return Math.max(number, 0) !== number;
}

function getCurrentTime(beAnArray = false) { // if beAnArray is true, it will return an array with the same info 
    let now = null;
    let hours = null;
    let hours12 = null;
    let minutes = null;
    let seconds = null;

    try {
        now = new Date();

        hours = now.getHours();
        hours12 = hours % 12 || 12;
        minutes = now.getMinutes();
        seconds = now.getSeconds();

    } catch (error) {
        // error handling
        console.error("Failed to get the time!");
        return null;
    }

    // RETURN TIME

    // return string
    if(!beAnArray) {
        return `${hours}:${minutes}:${seconds}`;
    }
    
    // return array
    return [hours, minutes, seconds];
}

function getTimeDifference(startTime, endTime) {
    // Helper function to convert time in HR:MIN:SEC format to total seconds
    function convertToSeconds(time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return (hours * 3600) + (minutes * 60) + seconds;
    }
  
    // Convert both start and end times to total seconds
    const startSeconds = convertToSeconds(startTime);
    const endSeconds = convertToSeconds(endTime);
  
    // Calculate the difference in seconds
    let diffInSeconds = endSeconds - startSeconds;
  
    // If the difference is negative, it means we've passed midnight
    if (diffInSeconds < 0) {
      diffInSeconds += 24 * 3600; // Add 24 hours worth of seconds
    }
  
    // Convert the difference back to milliseconds
    return diffInSeconds * 1000;
}

function randomArrayElement(array) {
    return (array[getRandomNumber(0, array.length)]);
}

function appendText(text) {
    const doc = document.createElement('p');
    doc.innerText = text;

    document.getElementById("DEBUG_FOLDER").appendChild(doc);
}

function checkIfValidJSON(jsonData) {
    try {
        JSON.parse(jsonData);
        return true;
    } catch (e) {
        return false;
    }
}

let rainbowInterval; // Global to store the interval ID

function formatPhoneNumber(tel) {
    if(tel.length === 10) {
        return "(" + tel.substring(0, 3) + ") " + tel.slice(3, 6) + "-" + tel.slice(6, 10);
    } else {
        return tel;
    }
}

function coinFlip() {
	if(getRandomNumber(0, 1) === 0) {
		return "Heads";
	}
	
	return "Tails";
}

function setScreenBrightness(brightness = 100) {
    // Apply brightness filter to the whole body
    document.body.style.cssText += `filter: brightness(${brightness}%)`;
}

function toggleExitWarning(enable) {
    if (enable) {
        window.onbeforeunload = function () {
            return "Are you sure you want to leave?";
        };
    } else {
        window.onbeforeunload = null;
    }
}

{
    // run theHell
    theHell(1, 0, false); 

}

function getTheHostName() {
    return window.location.href.replaceAll('http://', '').split('/')[0];
}

function blur(bool) {
    document.querySelectorAll('*').forEach(el => {
        // window.alert(el.tagName);

        if(el.tagName === 'HTML') return;
        if(el.tagName === 'HEAD') return;
        if(el.tagName === 'META') return;
        if(el.tagName === 'BODY') return;

        if(el.style) {
            const og = el.style.transition;
            el.style.transition = "all 0.5s ease";
            if(bool) {
                el.style.filter = "blur(2px)";
            } else {
                el.style.filter = "";
            }

            setTimeout(() => {
                el.style.transition = og;
            }, 500);
        }
        
    });
}