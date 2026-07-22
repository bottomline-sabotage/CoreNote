

function createCardObject(randomizedFront = undefined, category = undefined, explanation = undefined, hint = undefined, front = undefined, back = undefined, difficultyWeight = undefined ) {
    return {
        "randomizedFront": randomizedFront,
        "category": category,
        "explanation": explanation,
        "hint": hint,
        "front": front,
        "back": back,
        "difficultyWeight": difficultyWeight
    };
       
}

let foreverCardCount = 0;
function createCardDialogue() {
    if(foreverCardCount == 0) {
        document.querySelector("#create_card_link_first").style.display = "none";
        document.querySelector("#create_card_link").style.display = "inline";
    }

    const index = foreverCardCount;
    foreverCardCount++;

    const cardWindow = document.querySelector("#cards_spot");
    
    const card = document.createElement('div');
    card.id = `card-${index}`;
    card.className = "cardDialogue";

    const top = document.createElement('div');
    top.style.cssText = `display: flex; align-items: center; justify-content: space-between;`;
    // const actionShelf = document.createElement('div');
    // actionShelf.style.cssText = `background-color: white; padding: 5px; border-radius: 4px;`;
    // const deleteButton = document.createElement('a');
    // deleteButton.textContent = 'X';
    // deleteButton.style.color = "red";
    // actionShelf.appendChild(deleteButton);

    // top.appendChild(actionShelf);

    const count = document.createElement('span');
    count.textContent = `Card #${document.querySelectorAll(".cardDialogue").length + 1}`;
    count.className = "card_index";
    top.appendChild(count);
    
    const formatting = document.createElement('div');
    const frontSide = document.createElement('textarea');
    const backSide = document.createElement('textarea');
    
    // document.querySelectorAll(".-focus_check_for_new").forEach((el) => {
    //     // You ain't the newest
    //     el.className = "";
    // }); 
    // backSide.className = "-focus_check_for_new";
    

    // TODO: make left aligned
    const frontLabel = document.createElement('label');
    frontLabel.textContent = "Front";
    const backLabel = document.createElement('label');
    backLabel.textContent = "Back";

    const bottomHolder = document.createElement('div');
    bottomHolder.style.cssText = `display: flex; align-items: center;justify-content: space-around;`;
    const deleteButton = document.createElement('a');
    deleteButton.textContent = "Delete";
    deleteButton.style.color = "darkred";
    const addHintButton = document.createElement('a');
    addHintButton.textContent = "Add Hint";
    const addExplanationButton = document.createElement('a');
    addExplanationButton.textContent = "Add Explanation";

    bottomHolder.appendChild(deleteButton);
    bottomHolder.appendChild(addHintButton);
    bottomHolder.appendChild(addExplanationButton);

    card.append(
        top,
        formatting,
        document.createElement('br'),
        document.createElement('br'),
        frontLabel,
        document.createElement('br'),
        frontSide,
        document.createElement('br'),
        document.createElement('br'),
        backLabel,
        document.createElement('br'),
        backSide,
        document.createElement('br'),
        document.createElement('br'),
        bottomHolder
    );
    cardWindow.appendChild(card);

    frontSide.className = "card_front_side";
    backSide.className = "card_back_side";

    setTimeout(() => {
        document.querySelector("#create_card_link").scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, 50);

    deleteButton.onclick = () => {       
        document.querySelector(`#card-${index}`).remove();

        // Re-name cards
        document.querySelectorAll(".cardDialogue").forEach((el, i) => {
            const count = document.querySelector(`#${el.id} .card_index`);
            count.innerText = `Card #${i + 1}`;
        });
    
        document.querySelector("#info-number_of_cards").textContent = document.querySelectorAll(".cardDialogue").length;
    };
    

    frontSide.focus();

    document.querySelector("#info-number_of_cards").textContent = document.querySelectorAll(".cardDialogue").length;
}

// Tab create card handler
{
    window.addEventListener('keyup', (e) => { 
        if(e.key === 'Tab' && (/*document.activeElement?.classList.contains('-focus_check_for_new') || */document.activeElement?.classList.contains('-very_end_of_cards'))) {
            createCardDialogue();
        }
    });
}

function prettify(input) {
    let output = input;

    return output;
}

function generateJson() {
    const title = document.querySelector("#info-title");
    const description = document.querySelector("#info-description");
    const classInfo = document.querySelector("#info-class");
    const unit = document.querySelector("#info-unit_info");
    const author = document.querySelector("#info-author");

    const data = {
        "id": crypto.randomUUID(),
        "creator": author.value,
        "class": classInfo.value,
        "unitInfo": unit.value,
        "title": title.value,
        "version": 1,
        "description": description.value,
        "generationDate": Math.floor(Date.now() / 1000),

        "categories": [ ], 
    };
    data.cards = [];

    if(document.querySelectorAll(".cardDialogue").length < 1) {
        window.alert("You have no cards to save.");
        return;
    }

    document.querySelectorAll(".cardDialogue").forEach((el, i) => {
        const front = document.querySelector(`#${el.id} .card_front_side`);
        const back = document.querySelector(`#${el.id} .card_back_side`);
        
        data.cards.push(createCardObject(false, 0, "", "", prettify(front.value), prettify(back.value), 0));
    });

    return data;
}

function save() {
    const data = generateJson();

    const zip = new JSZip();
    zip.file("data.json", JSON.stringify(data));

    // Generate and download the file
    zip.generateAsync({ type: "blob", mimeType: "application/octet-stream" }).then((blob) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.title || "set"}.corenote`;
        a.click();

        URL.revokeObjectURL(url);
    });

    console.log(data);
}