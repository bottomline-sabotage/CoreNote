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