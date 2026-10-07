function resetClient() {

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
    titleBar.innerText = "Do you want to disconnect?";
    div.appendChild(titleBar);

    const message = document.createElement('div');
    message.className = "dialogue_box-message";
    div.appendChild(message)

    const yes = document.createElement('button');
    yes.className = "dialogue_box-button";
    yes.innerText = "Sir, yes, sir!"
    message.appendChild(yes);

    const no = document.createElement('button');
    no.className = "dialogue_box-button";
    no.innerText = "NO!!";
    message.appendChild(no);

    setTimeout(() => {
        div.style.opacity = 1;
    }, 10);

    yes.onclick = async () => {
        chrome.runtime.sendMessage({ "X-Action": 'restart' });
        await chrome.storage.local.clear();
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 50);
    }
    
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
}