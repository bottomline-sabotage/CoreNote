const ipAddressInput = document.getElementById("ip");
const portInput = document.getElementById("port");
const preview = document.getElementById('preview');
const connect = document.getElementById('connect')
const content = document.getElementById('content')

const updatePreview = () => {
    if(ipAddressInput.value.length < 1 && portInput.value.length < 1) {
        preview.innerHTML = ""; 
        return;     
    }
    preview.innerHTML = `Connecting to <u>http://${ipAddressInput.value || "127.0.0.1"}:${portInput.value || "1111"}</u>`
};

const ensureValid = () => {
    ipAddressInput.value = ipAddressInput.value.replace(/[a-zA-Z]/g, "");
    portInput.value = portInput.value.replace(/[a-zA-Z]/g, "");
}

portInput.addEventListener('keyup', ensureValid);
ipAddressInput.addEventListener('keyup', ensureValid);

portInput.addEventListener('keyup', updatePreview);
ipAddressInput.addEventListener('keyup', updatePreview);

const connectClick = async () => {
    if(!ipAddressInput.value || !portInput.value) return false;

    const host = `${ipAddressInput.value}:${portInput.value}`;
    chrome.storage.local.set({"host": host});

    connecter(host);
};

connect.addEventListener('click', connectClick);

chrome.storage.local.get().then((response) => {
    if(response.host) {
        connecter(response.host);
    }
});

async function connecter(host) {
    if(!host) return false;

    let timeout = setTimeout(async () => {
        content.innerHTML = `<h1>Failed to connect! (timeout)</h1>` 
        await sleep(1.5e+3);
        await chrome.storage.local.clear();
        window.location.href = window.location.href;
    }, 3e+3);

    content.innerHTML = "<h1>Connecting</h1>"

    const dot = ['', '.', '..', '...']; // OH GOD, HORRIBLE CODE

    let dotI = 1;
    const dotLoop = setInterval(() => {
        if(dotI > dot.length - 1) dotI = 0;
        content.innerHTML = `<h1>Connecting${dot[dotI]}</h1>`       
        dotI++;
    }, 500);

    let response;

    try {
        response = await fetch(`http://${host}/`, {
            "method": "POST",
            "headers": {
                "X-Action": "Info"
            },
            "body": "{}"
        });
    } catch (err) {
        clearTimeout(timeout);
        await sleep(3.5e+3);
        clearInterval(dotLoop);
        content.innerHTML = `<h1>Failed to connect!</h1>`   
        await sleep(1.5e+3);
        // window.alert(err);
        await chrome.storage.local.clear();
        window.location.href = window.location.href;
        return false;
    }
    
    // clearInterval(dotLoop);

    if(!response.ok) {
        clearTimeout(timeout);
        await sleep(3.5e+3);
        clearInterval(dotLoop);
        content.innerHTML = `<h1>Failed to connect!</h1>`   
        await sleep(1.5e+3);
        // window.alert(response.statusText);
        await chrome.storage.local.clear();
        window.location.href = window.location.href;
        return false;
    }

    try {

        const result = await response.json();

        if(result.message == "CoreNote Live") {
			clearTimeout(timeout);

			if(result.data === true) {
				await chrome.storage.local.set({gameActive: true});
			} else {
				await chrome.storage.local.set({gameActive: false});
			}

            window.location.href = "/SignIn.html";
            return;
        } else {
            throw new Error();
        }
    } catch (error) {
        clearTimeout(timeout);
        await sleep(3.5e+3);
        clearInterval(dotLoop);
        content.innerHTML = `<h1>Failed to connect!</h1>`   
        await sleep(1.5e+3);
        // window.alert(error);
        await chrome.storage.local.clear();
        window.location.href = window.location.href;
        return false;
    }

}