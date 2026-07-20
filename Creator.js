window.cardSet = {
    "id": undefined,
    "creator": undefined,
    "class": undefined,
    "unitInfo": undefined,
    "title": undefined,
    "version": 1,
    "description": undefined,
    "generationDate": undefined,

    "categories": [ ],

    "cards": [ ]   
};

// Updates
{
    const title = document.querySelector("#info-title");
    const description = document.querySelector("#info-description");
    const classInfo = document.querySelector("#info-class");
    const unit = document.querySelector("#info-unit_info");
    const author = document.querySelector("#info-author");

    title.addEventListener('change', () => {
        window.cardSet.title = title.value;
        console.log(window.cardSet);
    });
    description.addEventListener('change', () => {
        window.cardSet.description = description.value;
        console.log(window.cardSet);
    });
    classInfo.addEventListener('change', () => {
        window.cardSet.class = classInfo.value;
        console.log(window.cardSet);
    });
    unit.addEventListener('change', () => {
        window.cardSet.unitInfo = unit.value;
        console.log(window.cardSet);
    });
    author.addEventListener('change', () => {
        window.cardSet.creator = author.value;
        console.log(window.cardSet);
    });
}

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

function createCardDialogue() {
    const cardWindow = document.querySelector("#cards_spot");
    
    const card = document.createElement('div');
    card.className = "cardDialogue";

    const top = document.createElement('div');
    top.style.cssText = `display: flex; align-items: center; justify-content: space-between;`;
    const actionShelf = document.createElement('div');
    actionShelf.style.cssText = `background-color: white; padding: 5px; border-radius: 4px;`;
    const deleteButton = document.createElement('a');
    deleteButton.textContent = 'X';
    deleteButton.style.color = "red";
    actionShelf.appendChild(deleteButton);

    top.appendChild(actionShelf);

    const count = document.createElement('span');
    count.textContent = `Card #${window.cardSet.cards.length + 1}`;
    top.appendChild(count);
    
    const formatting = document.createElement('div');
    const front = document.createElement('textarea');
    const back = document.createElement('textarea');
    document.querySelectorAll(".-focus_check_for_new").forEach((el) => {
        // You ain't the newest
        back.className = "";
    }); 
    back.className = "-focus_check_for_new";
    

    const frontLabel = document.createElement('label');
    frontLabel.textContent = "Front";
    const backLabel = document.createElement('label');
    backLabel.textContent = "Back";

    card.append(
        top,
        formatting,
        document.createElement('br'),
        document.createElement('br'),
        frontLabel,
        document.createElement('br'),
        front,
        document.createElement('br'),
        document.createElement('br'),
        backLabel,
        document.createElement('br'),
        back
    );
    cardWindow.appendChild(card);

    card.scrollTo({});

    const index = window.cardSet.cards.length;
    window.cardSet.cards.push({});
}

window.addEventListener('keydown', (e) => {
    if(e.key == 'Tab' /* && object with class 'focus_check_for_new is focused'*/) {

    }
        
});