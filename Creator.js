function showCardTopBar() {
    const separator = document.querySelector("#card_bar_separator");
    const topBar = document.querySelector("#card_topbar");

    separator.style.height = "10.5vh";
    topBar.style.height = "10vh";
}

function hideCardTopBar() {
    const separator = document.querySelector("#card_bar_separator");
    const topBar = document.querySelector("#card_topbar");

    separator.style.height = "0vh";
    topBar.style.height = "0vh";
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

function reindexCards() {
    // Re-name cards
    document.querySelectorAll(".cardDialogue").forEach((el, i) => {
        const count = document.querySelector(`#${el.id} .card_index`);
        count.innerText = `#${i + 1}`;
    });
}

let foreverCardCount = 0;
let categories = [null];
let previousCategory = 0;
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
    card.style.backgroundColor = "white";
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

    // const mover = document.createElement('span');
    // mover.textContent = "|||";
    // mover.className = 'card_mover';
    // mover.style.cursor = "grab";
    // mover.style.color = "gray";
    // mover.style.transform = "scale(4, 0.8) rotate(90deg)"
    

    const count = document.createElement('span');
    count.textContent = `#${document.querySelectorAll(".cardDialogue").length + 1}`;
    count.className = "card_index";
    
    const menuButtonHolder = document.createElement('div');
    menuButtonHolder.className = "dropdown";

    const menuButton = document.createElement('span');
    menuButton.className = "options_button";
    menuButton.textContent = "•••";

    menuButtonHolder.appendChild(menuButton);

    top.appendChild(menuButtonHolder);
    // top.appendChild(mover);
    top.appendChild(count);
    
    // const formatting = document.createElement('div');
    const frontSide = document.createElement('div');
    frontSide.contentEditable = true;
    frontSide.placeholder = "Enter the Front Side";
    // frontSide.innerHTML = "<span class=\"note\">Enter the Front Side</span>";
    // frontSide.onfocus = () => {
    //     showCardTopBar(); // The problem is this shifts content. So, this may or may not work that well.
    // };
    // frontSide.onblur = () => {
    //     hideCardTopBar();
    // }
    const backSide = document.createElement('div');
    backSide.contentEditable = true;
    backSide.placeholder = "Enter the Back Side";
    // backSide.onfocus = () => {
    //     showCardTopBar();
    // };
    // backSide.onblur = () => {
    //     hideCardTopBar();
    // }
    
    // document.querySelectorAll(".-focus_check_for_new").forEach((el) => {
    //     // You ain't the newest
    //     el.className = "";
    // }); 
    // backSide.className = "-focus_check_for_new";
    

    // TODO: make left aligned
    // const frontLabel = document.createElement('label');
    // frontLabel.textContent = "Front";
    // const backLabel = document.createElement('label');
    // backLabel.textContent = "Back";

    const bottomHolder = document.createElement('div');
    bottomHolder.style.cssText = `display: flex; align-items: center;justify-content: space-around;`;
    // const deleteButton = document.createElement('a');
    // deleteButton.textContent = "Delete";
    // deleteButton.style.color = "darkred";
    const addHintButton = document.createElement('a');
    addHintButton.textContent = "+ Hint";
    addHintButton.className = "add_hint_button";
    const addExplanationButton = document.createElement('a');
    addExplanationButton.textContent = "+ Explanation";
    addExplanationButton.className = "add_explanation_button";

    const categoryHolder = document.createElement('div');
    categoryHolder.className = "dropdown";
    categoryHolder.className = "category_holder";
    const category = document.createElement('a');

    // console.log(previousCategory, categories);

    if(previousCategory) {
        category.textContent = categories[previousCategory] || "No Category";
        category.className = `category-${previousCategory}`;
    } else {
        category.className = `category-0`;
        category.textContent = "No Category";
    }
    categoryHolder.append(category);

    // bottomHolder.appendChild(deleteButton);
    bottomHolder.appendChild(addHintButton);
    bottomHolder.appendChild(categoryHolder);
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
    // hintContent.placeholder = "Hint";
    const explanationContent = document.createElement('input');
    explanationContent.style.width = "65%";
    explanationContent.style.maxHeight = "2vh";
    explanationContent.style.minHeight = "2vh";
    explanationContent.style.height = "2vh";
    explanationContent.className = "explanation_content";
    // explanationContent.placeholder = "Explanation";
    
    const hintStuff = document.createElement('div');
    hintStuff.style.display = "none";
    hintStuff.style.overflow = "hidden"
    hintStuff.style.transition = "all 0.3s ease";
    hintStuff.append(
            hintLabel,
            document.createElement('br'),
            hintContent,
            document.createElement('br'),
            document.createElement('br'),
    );
      
    const explanationStuff = document.createElement('div');
    explanationStuff.style.display = "none";
    explanationStuff.style.transition = "all 0.3s ease";
    explanationStuff.append(
            explanationLabel,
            document.createElement('br'),
            explanationContent,
            document.createElement('br'),
            document.createElement('br'),
    );

    card.append(
        top,
        // document.createElement('br'),
        document.createElement('br'),
        //frontLabel,
        //document.createElement('br'),
        frontSide,
        document.createElement('br'),
        document.createElement('br'),
        //backLabel,
       // document.createElement('br'),
        backSide,
        document.createElement('br'),
        document.createElement('br'),
        hintStuff,
        explanationStuff,
        bottomHolder,
    );
    cardWindow.appendChild(card);

    frontSide.className = "card_front_side editable_div";
    backSide.className = "card_back_side editable_div";

    setTimeout(() => {
        document.querySelector("#create_card_link").scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, 50);

    menuButton.onclick = () => {
        const div = document.createElement('div');
        div.className = "dropdown-content";
        div.innerHTML = ``;
        
        const mover = document.createElement('a');
        mover.textContent = "Move";
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

        const uploadAsset = document.createElement('a');
        uploadAsset.textContent = "Upload Asset";

        const rating = document.createElement('a');
        if(document.querySelector(`#card-${index} .star_rating`)) {
            rating.textContent = `Change Rating (${document.querySelector(`#card-${index} .star_rating`).textContent})`;
        } else {
            rating.textContent = "+ Rating";
        }
        rating.onclick = () => {
            const input = window.prompt("Enter Star Difficulty Rating (0-5, zero being easy, 5 being HARD)");
            let value = parseFloat(input);

            if(Number.isNaN(value)) {
                if(document.querySelector(`#card-${index} .star_rating`))
                    document.querySelector(`#card-${index} .star_rating`).remove();
                return;
            }

            value = Math.max(0, Math.min(5, value));
            value = Math.round(value * 2) / 2;

            rating.textContent = `Change Rating (${value})`;

            if(document.querySelector(`#card-${index} .star_rating`)) {
                document.querySelector(`#card-${index} .star_rating`).textContent = value;
            } else {
                const el = document.createElement('span');
                el.style.display = "none";
                el.textContent = value;
                el.className = 'star_rating';
                
                card.appendChild(el);
            }
        };
        
        const randomFront = document.createElement('a');
        if(document.querySelector(`#card-${index} .using_random`)) {
            randomFront.textContent = "Disable Random Front";
        } else {
            randomFront.textContent = "Enable Random Front";
        }
        randomFront.onclick = () => {
            // Disable
            if(document.querySelector(`#card-${index} .using_random`)) {
                document.querySelector(`#card-${index} .using_random`).remove();
                randomFront.textContent = "Enable Random Front";
                frontSide.placeholder = "Enter the Front Side";
            }

            // Enable
            else {
                randomFront.textContent = "Disable Random Front";
                const existence = document.createElement('span');
                existence.className = "using_random";
                existence.style.display = "none";
                card.append(existence);
                frontSide.placeholder = "Enter the Randomized Front Side\n\nEach line here will be treated as its own front side. When viewed, any one of the lines can be shown.";

                // sendNotification("Every line will be treated as its own randomized front.<br><br>When viewed, anyone of the fronts may be shown.", 4500);
            }
        };


        // const duplicate = document.createElement('a');
        // duplicate.textContent = "Duplicate";
        // duplicate.onclick = () => {
        //     cardWindow.appendChild(card);
        // };

        const deleteButton = document.createElement('a');
        deleteButton.style.color = 'darkred';
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            document.querySelector(`#card-${index}`).remove();

            reindexCards();
        
            document.querySelector("#info-number_of_cards").textContent = document.querySelectorAll(".cardDialogue").length;
        };
        
        div.append(
            uploadAsset,
            rating,
            randomFront,
            document.createElement('hr'),
            mover,
            // duplicate,
            deleteButton
        );

        div.style.opacity = 0;
        setTimeout(() => {
            div.style.opacity = 1;
            div.style.display = "block";
        }, 50);
        menuButtonHolder.appendChild(div);

        document.addEventListener('pointerup', function deleter() {
            setTimeout(() => {
                document.removeEventListener('pointerup', deleter);
                div.remove();
            }, 400);
            div.style.opacity = 0;
        });
    };

    category.onclick = () => {
        const div = document.createElement('div');
        div.className = "dropdown-content";
    
        
        let hadEmpty = false;
        for(let i = 0; i < categories.length; i++) {
            const el = document.createElement('a');
            if(!el.textContent && !hadEmpty) {
                el.textContent = "No Category"
                div.appendChild(el);
                hadEmpty = true;
                el.onclick = () => {
                    category.textContent = "No Category";
                    category.className = `category-${i}`;
                    previousCategory = 0; 
                };
                continue;
            }    

            el.onclick = () => {
                category.textContent = categories[i];
                category.className = `category-${i}`;
                console.log("Setting category to index of " + i);
                previousCategory = i; 
            };

            el.textContent = categories[i];
            div.appendChild(el);
        }

        const newCategory = document.createElement('a');
        newCategory.textContent = "New Category";
        newCategory.style.color = "blue";
        newCategory.onclick = () => {
            const ans = window.prompt("New Category");
            if(!ans) return;
            categories.push(ans);
            category.className = `category-${categories.length - 1}`;
            category.textContent = ans;
            previousCategory = categories.length - 1; 
        };

        div.append(
            document.createElement('hr'),            
            newCategory
        );

        div.style.opacity = 0;
        setTimeout(() => {
            div.style.opacity = 1;
            div.style.display = "block";
        }, 50);
        categoryHolder.appendChild(div);

        document.addEventListener('pointerup', function deleter() {
            setTimeout(() => {
                document.removeEventListener('pointerup', deleter);
                div.remove();
            }, 400);
            div.style.opacity = 0;
        });
    };

    addHintButton.onclick = () => {
        // Show
        if(hintStuff.style.display == "none") {
            hintStuff.style.display = "inline"; // TODO: animation
            hintStuff.style.height = "100%";
            
            addHintButton.textContent = "- Hint";
            addHintButton.style.color = 'darkred';
            hintContent.focus();
        } 
        
        // Hide and clear
        else {
            // setTimeout(() => {
                hintStuff.style.display = "none";
            // }, 400)
            hintStuff.style.height = "0%";
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
            explanationContent.focus();
        } 
        
        // Hide and clear
        else {
            explanationStuff.style.display = "none"; // TODO: animation
            explanationContent.value = "";

            addExplanationButton.textContent = "+ Explanation";
            addExplanationButton.style.color = '';
        }
    };

    // mover.onclick = () => {
    //     const cards = [...document.querySelectorAll(".cardDialogue")];

    //     const input = parseInt(prompt(`Move to card # (1-${cards.length})`), 10);
    //     if(isNaN(input))
    //         return;

    //     const newIndex = input - 1;

    //     if (newIndex < 0 || newIndex >= cards.length) return;

    //     const remaining = cards.filter(c => c !== card);

    //     if(newIndex >= remaining.length) {
    //         cardWindow.appendChild(card);
    //     } else {
    //         remaining[newIndex].before(card);
    //     }

    //     reindexCards();
    // };

    frontSide.focus();

    document.querySelector("#info-number_of_cards").textContent = document.querySelectorAll(".cardDialogue").length;

    return card;
}

// Tab create card handler
{
    window.addEventListener('keyup', (e) => { 
        if(e.key === 'Tab' && (/*document.activeElement?.classList.contains('-focus_check_for_new') || */document.activeElement?.classList.contains('-very_end_of_cards'))) {
            createCardDialogue();
        }
    });
}

function inversePrettify(input) {
    let output = String(input);

    // New lines
    output.replaceAll('<br>', '\n');

    return output;
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
        "version": 2,
        "description": description.value,
        "generationDate": Math.floor(Date.now() / 1000),

        "categories": categories, 
    };
    data.cards = [];

    if(document.querySelectorAll(".cardDialogue").length < 1) {
        // window.alert("You have no cards to save.");
        return undefined;
    }

    // // Save the LaTeX other than the formatted math
    // document.querySelectorAll(".inline_math_friend").forEach((el) => {
    //     const temp = el.innerHTML; // Move rendered to text
    //     el.innerHTML = el.title; // Move latex to innerHTML
    //     el.title = temp; // set rendered to title
    // });

    document.querySelectorAll(".cardDialogue").forEach((el, i) => {
        const front = document.querySelector(`#${el.id} .card_front_side`);
        const back = document.querySelector(`#${el.id} .card_back_side`);
        const hint = document.querySelector(`#${el.id} .hint_content`);
        const explanation = document.querySelector(`#${el.id} .explanation_content`);
        const rating = document.querySelector(`#${el.id} .star_rating`) || {textContent: null};
        const categoryHolder = document.querySelector(`#${el.id} .category_holder`);
        const category = categoryHolder.firstElementChild;
        const isUsingRandom = document.querySelector(`#${el.id} .using_random`) != null;

        let categoryIndex = parseInt(String(category.className).replace("category-", ""), 10);
        if(Number.isNaN(categoryIndex))
            categoryIndex = 0;

        let ratingNumber = parseFloat(rating.textContent);
        if(Number.isNaN(ratingNumber)) {
            ratingNumber = null;
        }

        let randomEntries = [];
        if(isUsingRandom) {
            randomEntries = Array.from(front.childNodes);
            for(let i = randomEntries.length - 1; i >= 0; i--) {
                if(!randomEntries[i].innerHTML || String(randomEntries[i].innerHTML).toLowerCase() == '<br>' ) {
                    randomEntries.splice(i, 1);
                    continue;
                }

                randomEntries[i] = prettify(randomEntries[i].innerHTML);
            }
        }
        
        data.cards.push(createCardObject(isUsingRandom, categoryIndex, explanation.value || "", hint.value || "", !isUsingRandom ? prettify(front.innerHTML) : randomEntries, prettify(back.innerHTML), ratingNumber));
    });

    // // Reorganize LaTeX
    // document.querySelectorAll(".inline_math_friend").forEach((el) => {
    //     const temp = el.innerHTML;
    //     el.innerHTML = el.title; 
    //     el.title = temp;
    // });

    return data;
}

function save() {
    if(document.querySelectorAll(".cardDialogue").length < 1) {
        window.alert("You have no cards to save.");
        return;
    }

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

    setTimeout(() => {
        console.log("Cleared emergency backup");
        localStorage.removeItem("e-emergencyBackup");
    }, 40e+3);
}

function loadFromJson(data) {
    // The easy part: *Metadata*
    {
        const title = document.querySelector("#info-title");
        const description = document.querySelector("#info-description");
        const classInfo = document.querySelector("#info-class");
        const unit = document.querySelector("#info-unit_info");
        const author = document.querySelector("#info-author");

        title.value = data.title;
        description.value = data.description;
        classInfo.value = data.class;
        unit.value = data.unitInfo;
        author.value = data.creator;

        categories = data.categories;
    }

    for(let i = 0; i < data.cards.length; i++) {
        const card = data.cards[i];
        const el = createCardDialogue();
        
        const front = document.querySelector(`#${el.id} .card_front_side`);
        const back = document.querySelector(`#${el.id} .card_back_side`);
        const hint = document.querySelector(`#${el.id} .hint_content`);
        const explanation = document.querySelector(`#${el.id} .explanation_content`);
        const rating = document.querySelector(`#${el.id} .star_rating`) || {textContent: null};
        const categoryHolder = document.querySelector(`#${el.id} .category_holder`);
        const category = categoryHolder.firstElementChild;

        if(card.randomizedFront) {
            card.front.forEach((_el, i) => {
                card.front[i] = inversePrettify(card.front[i]);
            });
            front.innerHTML = card.front.join('\n');
            const id = document.createElement('span');
            id.className = "using_random";
            el.appendChild(id);
            front.placeholder = "Enter the Randomized Front Side\n\nEach line here will be treated as its own front side. When viewed, any one of the lines can be shown.";
        } else 
            front.innerHTML = inversePrettify(card.front);
        back.innerHTML = inversePrettify(card.back);

        if(card.hint) {
            document.querySelector(`#${el.id} .add_hint_button`).onclick();
            hint.value = card.hint;
        }

        if(card.explanation) {
            document.querySelector(`#${el.id} .add_explanation_button`).onclick();
            explanation.value = card.explanation;
        }

        if(card.difficultyWeight) {
            const stars = document.createElement('span');
            stars.textContent = card.difficultyWeight;
            stars.style.display = "none";
            stars.className = "star_rating";
            el.appendChild(stars);
        }

        category.textContent = categories[card.category] || "No Category";
        category.className = `category-${card.category}`
    }
}

let backupTimeout = null;

document.addEventListener('keydown', () => {
    try {
        const js = generateJson();
        if(!js)
            return;
        if(backupTimeout !== null)
            return;
        localStorage.setItem("e-emergencyBackup", JSON.stringify(js));
        backupTimeout = setTimeout(() => {
            backupTimeout = null;
        }, 20e+3);
    } catch (err) {
        console.error(err);
    }
});

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
// document.addEventListener('pointerup', pointerUp);]

// document.querySelector("#bolden_text").addEventListener('pointerdown', (e) => {
//     e.preventDefault();
//     console.log(document.activeElement);

//     if(!document.activeElement.className.endsWith("editable_div"))
//         return;

//     const focusOffset = window.getSelection().focusOffset;

    
    
// });

function closestMatchingWrapper(node, wrapperEl) {
    while(node && node.nodeType !== Node.ELEMENT_NODE)
        node = node.parentNode;

    while(node) {
        if(sameFormatting(node, wrapperEl))
            return node;
        node = node.parentNode;
    }

    return null;
}

function sameFormatting(a, b) {
    if (a.tagName !== b.tagName)
        return false;

    // Compare attributes
    if (a.attributes.length !== b.attributes.length)
        return false;

    for (const attr of a.attributes) {
        if (a.getAttribute(attr.name) !== b.getAttribute(attr.name))
            return false;
    }

    return true;
}

// Opinions on AI Code:
/*
    This function was AI Generated, and so were a few others (you can tell because I am insistent on using `if()` rather than `if ()`)... so here's a rant. Now, my opinions on using AI for coding is "most of the time, no." Mainly because I like development because I get to figure stuff out; that's fun. However, JavaScript and CSS are two clear exceptions to that rule for me. I always go back to web dev... and it sucks. While C++ may be "hard," at least there aren't two null types (well, there actually is, but we don't need to think about that). What I'm trying to say is I don't typically use AI except for when it makes literally no sense for me not to; the same way I'd steal code from StackOverflow otherwise. When you have AI design things, it's usually horrible. But when you come up with the design and what it does and you just tell it to DO THINGS, it usually works. And, for a language like JavaScript, I don't care enough to know the exact implementation details. 

    I used to think learning with AI was a good idea. It's not. Go pick up a book. The problem is it's just so easy to get it to do it for you. Can you use an AI to reinforce ideas? Yeah! That's rad, bro! However, it's not good at introducing said ideas. Don't believe me? I learned JS/HTML/CSS from ChatGPT and--look--I'm still dependent on it. I learned C++ from a book and Vulkan from a series of articles, and I have no AI usage over there. I would go read a book on web dev, but I really hate it and don't want to use it past this project. Alas, I've been saying that for the past 2 years.
*/
function removeFormatting(wrapper, range) {

    const before = document.createRange();
    before.setStart(wrapper, 0);
    before.setEnd(range.startContainer, range.startOffset);

    const middle = range.extractContents();

    const after = document.createRange();
    after.setStart(range.endContainer, range.endOffset);
    after.setEnd(wrapper, wrapper.childNodes.length);

    const beforeFrag = before.cloneContents();
    const afterFrag = after.cloneContents();

    const parent = wrapper.parentNode;

    if (beforeFrag.childNodes.length) {
        const left = wrapper.cloneNode(false);
        left.append(beforeFrag);
        parent.insertBefore(left, wrapper);
    }

    parent.insertBefore(middle, wrapper);

    if (afterFrag.childNodes.length) {
        const right = wrapper.cloneNode(false);
        right.append(afterFrag);
        parent.insertBefore(right, wrapper);
    }

    parent.removeChild(wrapper);
}

// function inlineFormattingManager(wrapperEl) {
//     const editor = document.activeElement;

//     if(!editor?.className.endsWith("editable_div"))
//         return;

//     const sel = window.getSelection();

//     if(!sel.rangeCount || sel.isCollapsed)
//         return;

//     const range = sel.getRangeAt(0);

//     if(!editor.contains(range.commonAncestorContainer))
//         return;


//     try {
//         range.surroundContents(wrapperEl);
//     } catch {
//         // Selection partially overlaps elements.
//         const fragment = range.extractContents();
//         wrapperEl.appendChild(fragment);
//         range.insertNode(wrapperEl);
//     }

//     sel.removeAllRanges();
//     const newRange = document.createRange();
//     newRange.selectNodeContents(wrapperEl);
//     sel.addRange(newRange);
// }

function inlineFormattingManager(wrapperEl) {
    const editor = document.activeElement;

    if (!editor?.className.endsWith("editable_div"))
        return;

    const sel = window.getSelection();

    if (!sel.rangeCount || sel.isCollapsed)
        return;

    const range = sel.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer))
        return;

    const existing = closestMatchingWrapper(
        range.commonAncestorContainer,
        wrapperEl
    );

    if (existing && existing.contains(range.startContainer) && existing.contains(range.endContainer)) {
        removeFormatting(existing, range);
        return;
    }

    try {
        range.surroundContents(wrapperEl);
    } catch {
        const fragment = range.extractContents();
        wrapperEl.appendChild(fragment);
        range.insertNode(wrapperEl);
    }

    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapperEl);
    sel.addRange(newRange);
}

document.querySelector("#bolden_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const el = document.createElement('B');
    inlineFormattingManager(el);
});

document.querySelector("#italic_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const el = document.createElement('I');
    inlineFormattingManager(el);
});

document.querySelector("#underline_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const el = document.createElement('U');
    inlineFormattingManager(el);
});

document.querySelector("#color_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const colorInput = document.querySelector("#color_text_input");
    

    colorInput.addEventListener("change", function onChange() {
        colorInput.removeEventListener("change", onChange);

        const el = document.createElement("span");
        el.style.color = `${colorInput.value}`;
        inlineFormattingManager(el);
    }, { once: true });


    colorInput.click();

});

document.querySelector("#highlight_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const colorInput = document.querySelector("#highlight_text_input");

    colorInput.addEventListener("change", function onChange() {
        colorInput.removeEventListener("change", onChange);

        const el = document.createElement("span");
        el.className = "highlighter";
        el.style.backgroundColor = `${colorInput.value}`;
        inlineFormattingManager(el);
    }, { once: true });

    colorInput.click();
});

// Math and HTML are different

let inMathMode = false;
let mathEditFor = null;
document.querySelector("#math_notater_button").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    let savedRange = null;;
    const selection = window.getSelection();
    if(selection.rangeCount) {
        savedRange = selection.getRangeAt(0).cloneRange();
    }

    
    if(!document.activeElement.className.endsWith("editable_div") )
        return;

    const holder = document.querySelector("#html_raw_edit");

    const editor = document.querySelector("#html_raw_editor");

    document.querySelector("#html_raw_edit_math").style.display = "inline";

    const mathPreview = document.querySelector("#math_preview");
    mathPreview.innerHTML = "";

    function change () {
        mathPreview.innerHTML = `\\( ${editor.value} \\)`;

        try {
            console.log(renderMathInElement(mathPreview));
        } catch (err) { }
    }

    editor.addEventListener('keyup', change);

    function disabler() {
        inMathMode = false;
        holder.style.height = "0vh";

        mathEditFor.contentEditable = true;
        mathEditFor.style.opacity = 1;

        change();
        editor.removeEventListener('keyup', change);
        
        mathEditFor.focus();

        mathEditFor = null;
    }

    document.querySelector('#math_add').onclick = () => {
        insertHtmlAtRange(savedRange, `<span class="inline_math_friend">\\(${editor.value}\\)</\( ${editor.value} \\)span>`);
        disabler();

        if(!localStorage.getItem('c-mathLatexWarning')) {
            sendNotification("To make your formatting easier, your formula will be condensed to LaTeX while editing.", 5e+3);
            localStorage.setItem('c-mathLatexWarning', true);
        }
    };

    // Disable
    if(inMathMode) {
        disabler();
    }

    // Enable
    else {
        mathEditFor = document.activeElement;

        editor.value = '';

        editor.focus();

        document.querySelector("#html_raw_edit_desc").innerHTML = "Math Editor, <a href=\"https://www.overleaf.com/learn/latex/Mathematical_expressions\">see this guide</a>";

        holder.style.height = "40vh";
        inMathMode = true;

        mathEditFor.contentEditable = false;
        mathEditFor.style.opacity = 0.7;
    }
});

let htmlEditMode = false;
let htmlEditFor = null;
document.querySelector("#html_edit").addEventListener("pointerdown", function doer (e) {
    e.preventDefault();

    if(!document.activeElement.className.endsWith("editable_div") && document.activeElement.id != ("html_raw_editor"))
        return;

    const holder = document.querySelector("#html_raw_edit");

    const editor = document.querySelector("#html_raw_editor");

    document.querySelector("#html_raw_edit_math").style.display = "none";

    document.querySelector("#math_preview").innerHTML = "";

    function change () {
        htmlEditFor.innerHTML = String(editor.value).replaceAll('\n', "<br>");

        // try {
        //     renderMathInElement(htmlEditFor);
        // } catch (err) { }
    }

    editor.addEventListener('keyup', change);

    function disabler() {
        htmlEditMode = false;
        holder.style.height = "0vh";

        htmlEditFor.contentEditable = true;
        htmlEditFor.style.opacity = 1;

        change();
        editor.removeEventListener('keyup', change);
        
        htmlEditFor.focus();

        htmlEditFor = null;
    }

    // Disable
    if(htmlEditMode) {
        disabler();
    }

    // Enable
    else {
        htmlEditFor = document.activeElement;
        editor.value = htmlEditFor.innerHTML;

        editor.focus();

        document.querySelector("#html_raw_edit_desc").textContent = "HTML Editor";

        holder.style.height = "30vh";
        htmlEditMode = true;

        htmlEditFor.contentEditable = false;
        htmlEditFor.style.opacity = 0.7;

        const oldHtmlEditFor = htmlEditFor;
        editor.addEventListener('blur', function blur() {
            if(oldHtmlEditFor != htmlEditFor) {
                editor.removeEventListener('blur', blur);
                return;
            }

            disabler();

            editor.removeEventListener('blur', blur);
        });
    }

});

// Coloring for Color and Highlight
document.querySelector("#color_text_input").addEventListener('change', () => {
    document.querySelector("#color_text").style.color = document.querySelector("#color_text_input").value;
});
document.querySelector("#highlight_text_input").addEventListener('change', () => {
    document.querySelector("#highlight_text").style.backgroundColor = document.querySelector("#highlight_text_input").value;
});

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
if(!document.activeElement.className.endsWith("editable_div"))
        return;

    const isMac = navigator.platform.toLowerCase().includes("mac");

    if(!(isMac ? e.metaKey : e.ctrlKey))
       return;

    // console.log("MOVING");
    

    switch(e.key) {
    case 'i':
        document.querySelector("#italic_text").dispatchEvent(
    new PointerEvent("pointerdown", {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                pointerType: "mouse",
                isPrimary: true,
                button: 0,
                buttons: 1,
            })
        );
        break;
    case 'b':
        // console.log("yep");
        document.querySelector("#bolden_text").dispatchEvent(
    new PointerEvent("pointerdown", {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                pointerType: "mouse",
                isPrimary: true,
                button: 0,
                buttons: 1,
            })
        );
        break;
    case 'u':
        document.querySelector("#underline_text").dispatchEvent(
    new PointerEvent("pointerdown", {
                bubbles: true,
                cancelable: true,
                pointerId: 1,
                pointerType: "mouse",
                isPrimary: true,
                button: 0,
                buttons: 1,
            })
        );
        break;
    default: return;
    }

    e.preventDefault();
});

const vv = window.visualViewport;

function update() {
  document.querySelector("#card_topbar").style.transform =
    `translateY(${vv.offsetTop}px)`;
}

vv.addEventListener("resize", update);
vv.addEventListener("scroll", update);

update();
