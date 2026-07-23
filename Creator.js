

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

function reindexCards() {
    // Re-name cards
    document.querySelectorAll(".cardDialogue").forEach((el, i) => {
        const count = document.querySelector(`#${el.id} .card_index`);
        count.innerText = `Card #${i + 1}`;
    });
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
    // card.draggable = true;

    const top = document.createElement('div');
    top.style.cssText = `display: flex; align-items: center; justify-content: space-between;`;
    // const actionShelf = document.createElement('div');
    // actionShelf.style.cssText = `background-color: white; padding: 5px; border-radius: 4px;`;
    // const deleteButton = document.createElement('a');
    // deleteButton.textContent = 'X';
    // deleteButton.style.color = "red";
    // actionShelf.appendChild(deleteButton);

    // top.appendChild(actionShelf);

    const moveHolder = document.createElement('div');
    moveHolder.style.width = "100%";
    moveHolder.style.textAlign = "left";
    moveHolder.style.position = "relative";
    const mover = document.createElement('span');
    mover.textContent = "|||";
    mover.className = 'card_mover';
    // mover.style.letterSpacing = "-3px";
    mover.style.marginTop = "3%";
    mover.style.position = "absolute";
    mover.style.cursor = "grab";
    mover.style.color = "gray";
    mover.style.transform = "scale(0.8, 3)";
    moveHolder.append(mover);

    const count = document.createElement('span');
    count.textContent = `Card #${document.querySelectorAll(".cardDialogue").length + 1}`;
    count.className = "card_index";
    top.appendChild(count);

    const menuButton = document.createElement('span');
    menuButton.className = "options_button";
    menuButton.textContent = "•••";
    top.appendChild(menuButton);
    
    // const formatting = document.createElement('div');
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
    addHintButton.textContent = "+ Hint";
    const addExplanationButton = document.createElement('a');
    addExplanationButton.textContent = "+ Explanation";

    bottomHolder.appendChild(deleteButton);
    bottomHolder.appendChild(addHintButton);
    bottomHolder.appendChild(addExplanationButton);


    const hintLabel = document.createElement('label');
    hintLabel.textContent = "Hint";
    const explanationLabel = document.createElement('label');
    explanationLabel.textContent = "Explanation";

    const hintContent = document.createElement('input');
    hintContent.style.width = "65%";
    hintContent.style.maxHeight = "2vh";
    hintContent.style.minHeight = "2vh";
    hintContent.style.height = "2vh";
    hintContent.className = "hint_content";
    const explanationContent = document.createElement('input');
    explanationContent.style.width = "65%";
    explanationContent.style.maxHeight = "2vh";
    explanationContent.style.minHeight = "2vh";
    explanationContent.style.height = "2vh";
    explanationContent.className = "explanation_content";
    
    const hintStuff = document.createElement('div');
    hintStuff.style.display = "none";
    hintStuff.append(
        hintLabel,
            document.createElement('br'),
            hintContent,
            document.createElement('br'),
            document.createElement('br'),
    );
      
    const explanationStuff = document.createElement('div');
    explanationStuff.style.display = "none";
    explanationStuff.append(
        explanationLabel,
            document.createElement('br'),
            explanationContent,
            document.createElement('br'),
            document.createElement('br'),
    );

    card.append(
        top,
        moveHolder,
        // formatting,
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
        hintStuff,
        explanationStuff,
        bottomHolder,
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

        reindexCards();
    
        document.querySelector("#info-number_of_cards").textContent = document.querySelectorAll(".cardDialogue").length;
    };

    addHintButton.onclick = () => {
        // Show
        if(hintStuff.style.display == "none") {
            hintStuff.style.display = "inline"; // TODO: animation
            
            addHintButton.textContent = "- Hint";
            addHintButton.style.color = 'darkred';
        } 
        
        // Hide and clear
        else {
            hintStuff.style.display = "none"; // TODO: animation
            hintContent.value = "";
            
            addHintButton.textContent = "+ Hint";
            addHintButton.style.color = '';
        }
    };

    addExplanationButton.onclick = () => {
        // Show
        if(explanationStuff.style.display == "none") {
            explanationStuff.style.display = "inline"; // TODO: animation

            addExplanationButton.textContent = "- Explanation";
            addExplanationButton.style.color = 'darkred';
        } 
        
        // Hide and clear
        else {
            explanationStuff.style.display = "none"; // TODO: animation
            explanationContent.value = "";

            addExplanationButton.textContent = "+ Explanation";
            addExplanationButton.style.color = '';
        }
    };

    mover.onclick = () => {
        const cards = [...document.querySelectorAll(".cardDialogue")];

        const input = parseInt(prompt(`Move to card # (1-${cards.length})`), 10);
        if(isNaN(input))
            return;

        const newIndex = input - 1;

        if (newIndex < 0 || newIndex >= cards.length) return;

        const remaining = cards.filter(c => c !== card);

        if(newIndex >= remaining.length) {
            cardWindow.appendChild(card);
        } else {
            remaining[newIndex].before(card);
        }

        reindexCards();
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
    let output = String(input);

    // New lines
    output = output.replaceAll('\n', '<br>');

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
        const hint = document.querySelector(`#${el.id} .hint_content`);
        const explanation = document.querySelector(`#${el.id} .explanation_content`);
        
        data.cards.push(createCardObject(false, 0, explanation.value || "", hint.value || "", prettify(front.value), prettify(back.value), 0));
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

// let downEl = null;
// const pointerDown = (e) => {
    
//     if(e.target.className == "card_mover" && downEl == null) {
//         downEl = e.target.parentElement.parentElement;
//         downEl.style.opacity = 0.5;
//         downEl.style.position = "absolute";
//         downEl.style.width = "2vw";
//         downEl.style.height = "2vw";
//         document.querySelectorAll(".cardDialogue > *").forEach((el) => {
//             el.style.opacity = 0
//         });
//     }
// };
// const pointerMove = (e) => {
//     if(downEl == null)
//         return;

//     downEl.style.top = `${e.clientY}px`;
//     downEl.style.left = `${e.clientX}px`;
// };
// const pointerUp = (e) => {
//     if(downEl == null)
//         return;

//     downEl.style.width = "";
//     downEl.style.height = "";
//     downEl.style.position = "relative";
//     downEl.style.opacity = 1;
//     downEl.style.left = ``;
//     document.querySelectorAll(".cardDialogue > *").forEach((el) => {
//         el.style.opacity = 1
//     });
//     downEl = null;
// };

// document.addEventListener('pointerdown', pointerDown);
// document.addEventListener('pointermove', pointerMove);
// document.addEventListener('pointerup', pointerUp);