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
        // document.querySelector("#create_card_link_first").style.display = "none";
        // document.querySelector("#create_card_link").style.display = "inline";
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
    frontSide.contentEditable = "plaintext-only";
    frontSide.setAttribute('placeholder', "Enter the Front Side");
    // frontSide.innerHTML = "<span class=\"note\">Enter the Front Side</span>";
    // frontSide.onfocus = () => {
    //     showCardTopBar(); // The problem is this shifts content. So, this may or may not work that well.
    // };
    // frontSide.onblur = () => {
    //     hideCardTopBar();
    // }
    const backSide = document.createElement('div');
    backSide.contentEditable = "plaintext-only";
    backSide.setAttribute('placeholder', "Enter the Back Side");
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

    const editable = (e) => {
        updatePlaceholder(e.currentTarget)
    };
    frontSide.addEventListener('keyup', editable);
    backSide.addEventListener('keyup', editable);
    updatePlaceholder(frontSide);
    updatePlaceholder(backSide);
    
    // For copy and paste... I don't know how else to do this?
    const hackyInterval = setInterval(() => {
        updatePlaceholder(frontSide);
        updatePlaceholder(backSide);
    }, 500)

    setTimeout(() => {
        document.querySelector("#create_card_link").scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }, 50);
    
    const assetOnClick = (e) => {
        const input = document.querySelector("#asset_upload");
        
        if(window.assetUploadLock) return;
        window.assetUploadLock = true;
        
        for(const theFile of input.files) {
            const file = renameFile(theFile, `${crypto.randomUUID()}`);

            if(file.size > 5e+6)
                window.alert("This file is really large (>5MB). While we will let you use it, just note that some devices (particularly, smartphones, may be unable to use your set without disabling assets.");

            let el;

            if (file.type.startsWith('image/')) {
                // const blob = createPngBlobFromImage(file); // Convert to PNG
                el = document.createElement('img');
                el.src = URL.createObjectURL(file);
            }
            else if (file.type.startsWith('video/')) {
                el = document.createElement('video');
                el.src = URL.createObjectURL(file);
                el.controls = true;
            }
            else if (file.type.startsWith('audio/')) {
                el = document.createElement('audio');
                el.src = URL.createObjectURL(file);
                el.controls = true;
            }
            else {
                el = document.createElement('a');
                el.href = URL.createObjectURL(file);
                el.download = file.name;
                el.textContent = `📄 ${theFile.name}`;
            }

            el.className = "uploaded_asset";
            el.id = `Assets-_-${String(file.name).replaceAll('/', '-_-').replaceAll(' ', '_-_')}`;
            el.src = URL.createObjectURL(file);
            // el.onload = () => {URL.revokeObjectURL(el.src)}; // Nope, you Fool! You uppercase f FOOL! Kill yourself... but not right now! We're BUSY! 

            const raper = document.createElement('div');
            raper.append(el);
            
            sendNotification("Click either the Front or Back Side to insert it.", 50e+3);

            let first = true;
            let addFront = () => {
                if(!first)
                    return
                first = false;

                const spacerForTypingAround1 = document.createElement('div');
                spacerForTypingAround1.innerHTML = "&nbsp;";
                const spacerForTypingAround2 = document.createElement('div');
                spacerForTypingAround2.innerHTML = "&nbsp;";
                
                
                frontSide.append(
                    spacerForTypingAround1,
                    raper,
                    spacerForTypingAround2
                );

                document.querySelectorAll('.notification').forEach((e) => {
                    e.remove();
                });
                
                window.assetUploadLock = false;
            };
            let addBack = () => {
                if(!first)
                    return
                first = false;

                const spacerForTypingAround1 = document.createElement('div');
                spacerForTypingAround1.innerHTML = "&nbsp;";
                const spacerForTypingAround2 = document.createElement('div');
                spacerForTypingAround2.innerHTML = "&nbsp;";
                
                
                backSide.append(
                    spacerForTypingAround1,
                    raper,
                    spacerForTypingAround2
                );

                document.querySelectorAll('.notification').forEach((e) => {
                    e.remove();
                });
                
                window.assetUploadLock = false;
            };

            frontSide.addEventListener('click', () => {
                addFront();
            }, {once: true});
            backSide.addEventListener('click', () => {
                addBack();
            }, {once: true});
        }
    };

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
        uploadAsset.onclick = () => {
            const input = document.querySelector("#asset_upload");
            if(!localStorage.getItem("c-hadAssetPrompt")) {
                localStorage.setItem("c-hadAssetPrompt", true);
                // window.alert("");
            }

            input.value = null;
            input.click();
            
            input.oncancel = () => {
                window.assetUploadLock = false;
                input.removeEventListener('change', assetOnClick, {once: true});
            }
            
            input.removeEventListener('change', assetOnClick, {once: true});
            
            window.assetUploadLock = false;

            input.addEventListener('change', assetOnClick, {once: true});

            
        };

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
        
        // const hyperlink = document.createElement('a');
        // hyperlink.textContent = "+ Hyperlink";
        // hyperlink.onclick = () => {
        //     //.TIDIL
        // };

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
                frontSide.setAttribute("placeholder", "Enter the Front Side")
            }

            // Enable
            else {
                randomFront.textContent = "Disable Random Front";
                const existence = document.createElement('span');
                existence.className = "using_random";
                existence.style.display = "none";
                card.append(existence);
                frontSide.setAttribute("placeholder", "Enter the Randomized Front Side\n\nEach line here will be treated as its own front side. When viewed, any one of the lines can be shown.");

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
            clearInterval(hackyInterval);

            document.querySelector(`#card-${index}`).remove();

            reindexCards();
        
            document.querySelector("#info-number_of_cards").textContent = document.querySelectorAll(".cardDialogue").length;

            frontSide.removeEventListener('change', editable);
            backSide.removeEventListener('change', editable);     
        };
        
        div.append(
            uploadAsset,
            rating,
            // hyperlink,
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
            console.log(categories[i]);
            if(!categories[i] && !hadEmpty) {
                const el = document.createElement('a');
                el.textContent = "No Category"
                div.appendChild(el);
                hadEmpty = true;
                el.onclick = () => {
                    category.textContent = "No Category";
                    category.className = `category-${i}`;
                    previousCategory = 0; 
                };
                continue;
            } else if(!categories[i] && hadEmpty) continue;
            
            const el = document.createElement('a');
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
            loadCategoriesToSettings();
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
    document.querySelectorAll(".math_area").forEach((e) => {
        e.opacity = 0;
        setTimeout(() => {
            e.remove();
        }, 500);
    });

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

async function save() {
    callLoad();

    if(document.querySelectorAll(".cardDialogue").length < 1) {
        window.alert("You have no cards to save.");
        endLoad();
        return;
    }

    const data = generateJson();

    const zip = new JSZip();
    zip.file("data.json", JSON.stringify(data));

    const assetsFolder = zip.folder("Assets");
    const promises = [];

    if(document.querySelectorAll(".uploaded_asset").length > window.HIGH_ASSET_COUNT) {
        window.alert("This card set has a lot of assets (>20). Note that some devices (particularly, smartphones, may be unable to use your set without disabling assets.");
        window.alreadyHadSizeWarning = true;
    }

    document.querySelectorAll(".uploaded_asset").forEach((el) => {
        const url = el.src || el.href; // Object URL (blob:)
        const fileName = String(el.id).split("Assets-_-")[1];
        
        const oldSrc = el.src;
        const oldHref = el.href;

        el.src = null;
        el.href = null;

        // I Love then chains!
        promises.push(
            fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    assetsFolder.file(fileName, blob);
                    el.src = oldSrc;
                    el.href = oldHref;
                })
        );
    });

    await Promise.all(promises);


    // Generate and download the file
    const blob = await zip.generateAsync({ type: "blob", mimeType: "application/octet-stream" })
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title || "set"}.corenote`;
    a.click();

    URL.revokeObjectURL(url);

    console.log(data);

    setTimeout(() => {
        console.log("Cleared emergency backup");
        localStorage.removeItem("e-emergencyBackup");
    }, 40e+3);

    endLoad();
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
            front.setAttribute("placeholder", "Enter the Randomized Front Side\n\nEach line here will be treated as its own front side. When viewed, any one of the lines can be shown.");
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

    loadCategoriesToSettings()
}

async function uploadSet() {
    callLoad();

    const fileInput = document.querySelector("#file_input");
    const file = fileInput.files[0];

    let cardZip = null;
    let json;
	try {
		cardZip = await JSZip.loadAsync(file);
	    json = JSON.parse(await cardZip.file("data.json").async("string"));	
        for(let i = 0; i < json.cards.length; i++) {
            json.cards[i].index = i; // Set index
        }
	} catch (err) {
		console.error(err);
		window.alert("Failed to load set. Please upload another.");
        cover.style.cssText = "opacity: 0; padding: 0px; max-height: 0vh;";
        endLoad();
        return;
	}

    const cardAssets = {};
    for(const file of Object.values(cardZip.files)) {
        if(file.dir || !String(file.name).startsWith("Assets/")) 
            continue;
        const id = `${String(file.name).replaceAll('/', '-_-').replaceAll('\\', '-_-').replaceAll(' ', '_-_')}`;

        // if(json.version < 2) {
        //     id = id.replaceAll('.', '\\.'); // This should never be a problem, however my sets made before the creator for whatever need this
        // }

        const bytes = await file.async("uint8array");

        const blob = new Blob([bytes], { });

        const url = URL.createObjectURL(blob);
        cardAssets[id] = url;
    }

    loadFromJson(json);
    start();

    if(json.version < 2) {
        document.querySelectorAll('img').forEach((el) => { // pre version 2 didn't have .uploaded_asset
            el.src = cardAssets[el.id];
        });
    } else {
        document.querySelectorAll('.uploaded_asset').forEach((el) => {
            el.src = cardAssets[el.id];
            el.href = cardAssets[el.id];
        });
    }

    endLoad();
}

function refreshCategories(i) {
    // for(let i = 0; i < categories.length; i++) {
    document.querySelectorAll(`.category-${i}`).forEach((el) => {
        if(!categories[i]) {
            el.textContent = "No Category";
            el.className = "category-0"; // Just try to point them all to zero. 
        } else {
            el.textContent = categories[i];
        }
    });
    // }
}

function loadCategoriesToSettings() {
    const container = document.querySelector("#categories_queen");
    container.innerHTML = '';
    let hadNull = false;
    
    function generator(name, index, haveStuff = true) {
        const div = document.createElement('div');
        div.className = "category_description";
        div.style.width = "100%";
        if(haveStuff) 
            div.innerHTML = `<b>${name}, </b>`;
        else
            div.innerHTML = `<b>${name}</b>`;

        if(!haveStuff) {
            // We done earliy boys!
            container.append(div);
            return;
        }

        console.log(name);

        const rename = document.createElement('a');
        rename.textContent = "Rename";
        rename.style.marginRight = "6px";
        rename.onclick = () => {
            const prompt = window.prompt("Rename");
            if(!prompt) return;
            categories[index] = prompt;
            refreshCategories(index);
            loadCategoriesToSettings();
        };
        const remove = document.createElement('a');
        remove.textContent = "Remove";
        remove.onclick = () => {
            categories[index] = null; // Logical removing, bby
            refreshCategories(index);
            loadCategoriesToSettings();
        };

        div.append(rename, remove);

        container.append(div);
    }

    for(let i = 0; i < categories.length; i++) {
        if(hadNull && !categories[i]) {
            continue;
        } else if(!hadNull && !categories[i]) {
            generator("No Category", i, false);
            hadNull = true;
            continue;
        }

        generator(categories[i], i, true);
    }
}
loadCategoriesToSettings(); // For no category

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

function unwrapHighlighter(element) {
    if (!element || element.tagName.toLowerCase() !== "highlight") {
        throw new Error("Expected a <highlighter> element.");
    }

    // Remove all descendant highlighters first.
    for (const child of [...element.querySelectorAll("highlight")]) {
        while (child.firstChild) {
            child.parentNode.insertBefore(child.firstChild, child);
        }
        child.remove();
    }

    let current = element;
    let parent = current.parentElement;

    while (parent && parent.tagName.toLowerCase() === "highlight") {
        const nextParent = parent.parentElement;
        parent.replaceWith(current);
        parent = nextParent;
    }

    return parent;
}

function closestMatchingWrapperInline(node, wrapperEl) {
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

function removeFormatting(wrapper, range) {fdsa
    const selection = window.getSelection();

    // Preserve the original selection
    const original = range.cloneRange();

    // BEFORE
    const before = document.createRange();
    before.setStart(wrapper, 0);
    before.setEnd(original.startContainer, original.startOffset);
    const beforeFrag = before.cloneContents();

    // AFTER
    const after = document.createRange();
    after.setStart(original.endContainer, original.endOffset);
    after.setEnd(wrapper, wrapper.childNodes.length);
    const afterFrag = after.cloneContents();

    // MIDDLE
    const middle = original.extractContents();

    // Save references before inserting the fragment
    const firstSelected = middle.firstChild;
    const lastSelected = middle.lastChild;

    const parent = wrapper.parentNode;

    // Left wrapper
    if (beforeFrag.childNodes.length) {
        const left = wrapper.cloneNode(false);
        left.append(beforeFrag);
        parent.insertBefore(left, wrapper);
    }

    // Selected content (without formatting)
    parent.insertBefore(middle, wrapper);

    // Right wrapper
    if (afterFrag.childNodes.length) {
        const right = wrapper.cloneNode(false);
        right.append(afterFrag);
        parent.insertBefore(right, wrapper);
    }

    // Remove original wrapper
    parent.removeChild(wrapper);

    // Restore selection
    if (firstSelected && lastSelected) {
        const newRange = document.createRange();
        newRange.setStartBefore(firstSelected);
        newRange.setEndAfter(lastSelected);

        selection.removeAllRanges();
        selection.addRange(newRange);
    }
}

function closestMatchingWrapper(node, tagName) {
    let el = node.nodeType === Node.ELEMENT_NODE
        ? node
        : node.parentElement;

    return el?.closest(tagName) ?? null;
}

function inlineFormattingManager(wrapperEl, sel = undefined, editor = undefined) {
    if(!editor)
        editor = document.activeElement;

    if (!editor?.className.endsWith("editable_div"))
        return;

    if(!sel)
        sel = window.getSelection();

    if(sel.isCollapsed) {
        sendNotification("You have to select the text you want to style.", 4e+3);
        return;  
    }

    if (!sel.rangeCount || sel.isCollapsed)
        return;


    const range = sel.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer))
        return;

    if(wrapperEl.tagName == 'highlight')
        unwrapHighlighter(wrapperEl);

    let existing;
    // if(String(wrapperEl.tagName) == "" || String(wrapperEl.tagName) == "") {

    // } else {
        existing = closestMatchingWrapperInline(
            range.commonAncestorContainer,
            wrapperEl
        );
    // }

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

// Opinions on AI Code:
/*
    This function was AI Generated, and so were a few others (you can tell because I am insistent on using `if()` rather than `if ()`)... so here's a rant. Now, my opinions on using AI for coding is "most of the time, no." Mainly because I like development because I get to figure stuff out; that's fun. However, JavaScript and CSS are two clear exceptions to that rule for me. I always go back to web dev... and it sucks. While C++ may be "hard," at least there aren't two null types (well, there actually is, but we don't need to think about that). What I'm trying to say is I don't typically use AI except for when it makes literally no sense for me not to; the same way I'd steal code from StackOverflow otherwise. When you have AI design things, it's usually horrible. But when you come up with the design and what it does and you just tell it to DO THINGS, it usually works. And, for a language like JavaScript, I don't care enough to know the exact implementation details. 

    I used to think learning with AI was a good idea. It's not. Go pick up a book. The problem is it's just so easy to get it to do it for you. Can you use an AI to reinforce ideas? Yeah! That's rad, bro! However, it's not good at introducing said ideas. Don't believe me? I learned JS/HTML/CSS from ChatGPT and--look--I'm still dependent on it. I learned C++ from a book and Vulkan from a series of articles, and I have no AI usage over there. I would go read a book on web dev, but I really hate it and don't want to use it past this project. Alas, I've been saying that for the past 2 years.
*/

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

document.querySelector("#bolden_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const el = document.createElement('B');
    inlineFormattingManager(el);
});

document.querySelector("#strikethrough_text").addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const el = document.createElement('DEL');
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

document.querySelector("#color_text").addEventListener("pointerdown", async (e) => {
    e.preventDefault();

    const sel = window.getSelection();
    const editor = document.activeElement;

    const popup = createPopup(`
        <h1>Color Style</h1>
        <input id="color_text_input" type="color" style="opacity: 0; height: 0vh; overflow: hidden; "><br>
        <a id="color_pick">Pick a Color</a><br><br>
        <a>Cancel</a>
    `);

    popup.style.opacity = 0;
    document.body.append(popup);
    setTimeout(() => {
        popup.style.opacity = 1;
    }, 50);
    
    await sleep(500);

    document.addEventListener('pointerdown', function fds (e) {
        if(e.target.id == "color_text_input") {
            return;
        }

        if(e.target.id == "color_pick") {
            const colorInput = document.querySelector("#color_text_input");

            colorInput.addEventListener("change", function onChange() {
                
                const el = document.createElement("coloredText");
                el.style.color = `${colorInput.value}`;
                document.querySelector("#color_text").style.color = el.style.color;

                console.log(el);

                inlineFormattingManager(el, sel, editor);

                
                document.removeEventListener('pointerdown', fds);
                colorInput.removeEventListener("change", onChange);
                
                popup.style.opacity = 0;
                setTimeout(() => {
                    popup.remove();
                }, 500);
            });

            colorInput.click();
        } else {
            popup.style.opacity = 0;
            setTimeout(() => {
                popup.remove();
            }, 500);

            document.removeEventListener('pointerdown', fds);
        }
    });
});

document.querySelector("#highlight_text").addEventListener("pointerdown", async (e) => {
    // e.preventDefault();

    const sel = window.getSelection();
    const editor = document.activeElement;

    const popup = createPopup(`
        <h1>Highlight Style</h1>
        <input id="highlight_pick_input" type="color" style="opacity: 0; height: 0vh; overflow: hidden; "><br>
        <a id="highlight_pick">Pick a Color</a><br><br>
        <a id="highlight_pick-none">None</a><br><br>
        <a >Cancel</a>
    `);

    popup.style.opacity = 0;
    document.body.append(popup);
    setTimeout(() => {
        popup.style.opacity = 1;
    }, 50);
    
    await sleep(500);

    document.addEventListener('pointerdown', function fds (e) {
        if(e.target.id == "color_text_input") {
            return;
        }

        if(e.target.id == "highlight_pick") {
            const highlightInput = document.querySelector("#highlight_pick_input");

            highlightInput.addEventListener("change", function onChange() {
                
                const el = document.createElement("highlight");
                el.className = "highlighter";
                el.style.backgroundColor = `${highlightInput.value}`;
                document.querySelector("#highlight_text").style.backgroundColor = el.style.color; // TODO: alpha

                inlineFormattingManager(el, sel, editor);

                
                document.removeEventListener('pointerdown', fds);


                highlightInput.removeEventListener("change", onChange);
                popup.style.opacity = 0;
                setTimeout(() => {
                    popup.remove();
                }, 500);
            });

            highlightInput.click();
        } else if(e.target.id == "highlight_pick-none") {
            const el = document.createElement("highlighter");
            el.className = "highlighter";
            el.style.backgroundColor = ``;
            document.querySelector("#highlight_text").style.backgroundColor = "";

            popup.style.opacity = 0;
            setTimeout(() => {
                popup.remove();
            }, 500);

            inlineFormattingManager(el, sel, editor);
        } else {
            popup.style.opacity = 0;
            setTimeout(() => {
                popup.remove();
            }, 500);

            document.removeEventListener('pointerdown', fds);
        }
    });

    // const colorInput = document.querySelector("#highlight_text_input");

    // colorInput.addEventListener("change", function onChange() {
    //     colorInput.removeEventListener("change", onChange);

    //     const el = document.createElement("span");
    //     el.className = "highlighter";
    //     el.style.backgroundColor = `${colorInput.value}`;
    //     inlineFormattingManager(el);
    // }, { once: true });

    // colorInput.click();
});

// Math and HTML are different

let inMathMode = false;
let mathEditFor = null;
let htmlEditMode = false;
let htmlEditFor = null;
document.querySelector("#math_notater_button").addEventListener("pointerdown", (e) => {
    if(htmlEditMode) 
        return;

    document.querySelector("#html_only_api_view").style.display = "none";

    e.preventDefault();

    let savedRange = null;;
    const selection = window.getSelection();
    if(selection.rangeCount) {
        savedRange = selection.getRangeAt(0).cloneRange();
    }

    if(!document.activeElement.classList.contains("editable_div") && e.currentTarget.id != "math_notater_button")
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

    editor.addEventListener('input', change);

    function disabler() {
        inMathMode = false;
        holder.style.height = "0vh";

        mathEditFor.contentEditable = "plaintext-only";
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
            sendNotification("To make your formatting easier, your formula will be condensed to LaTeX while editing. When you edit it or click/tap on it, you can see the math preview again", 7e+3);
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
        if(!mathEditFor.classList.contains('editable_div')) {
            mathEditFor = null;
            return;
        }

        editor.value = '';

        editor.focus();

        document.querySelector("#html_raw_edit_desc").innerHTML = "Math Editor, <a href=\"https://www.overleaf.com/learn/latex/Mathematical_expressions\">see this guide</a>";

        holder.style.height = "40vh";
        inMathMode = true;

        mathEditFor.contentEditable = false;
        mathEditFor.style.opacity = 0.7;
    }
});


document.querySelector("#html_edit").addEventListener("pointerdown", function doer (e) {
    if(inMathMode) 
        return;

    document.querySelector("#html_only_api_view").style.display = "inline";

    if(document.activeElement.id != "click_me_html_please")
        e.preventDefault();
    else
        return;

    
    if(!document.activeElement.classList.contains("editable_div") && document.activeElement.id != ("html_raw_editor") && e.currentTarget.id != "html_edit")
        return;
    
    // console.log(
    //     !document.activeElement.classList.contains("editable_div"),
    //     document.activeElement.id != ("html_raw_editor"),
    //     e.currentTarget.id != "html_edit",
    //     !document.activeElement.classList.contains("editable_div") && document.activeElement.id != ("html_raw_editor") && e.currentTarget.id != "html_edit"
    // )

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
        if(document.activeElement.id == "click_me_html_please")
            return;

        htmlEditMode = false;
        holder.style.height = "0vh";

        htmlEditFor.contentEditable = "plaintext-only";
        htmlEditFor.style.opacity = 1;

        change();
        editor.removeEventListener('keyup', change);
        
        htmlEditFor.focus();

        htmlEditFor = null;
    }

    // Disable
    if(htmlEditMode) {
        if(document.activeElement.id == "click_me_html_please")
            return;

        disabler();
    }

    // Enable
    else {
        htmlEditFor = document.activeElement;
        if(!htmlEditFor.classList.contains('editable_div')) {
            htmlEditFor = null;
            return;
        }
        editor.value = htmlEditFor.innerHTML;

        editor.focus();

        document.querySelector("#html_raw_edit_desc").innerHTML = "HTML Editor";

        holder.style.height = "30vh";
        htmlEditMode = true;

        htmlEditFor.contentEditable = false;
        htmlEditFor.style.opacity = 0.7;
    }

});

// Coloring for Color and Highlight
// document.querySelector("#color_text_input").addEventListener('change', () => {
//     document.querySelector("#color_text").style.color = document.querySelector("#color_text_input").value;
// });
// document.querySelector("#highlight_text_input").addEventListener('change', () => {
//     document.querySelector("#highlight_text").style.backgroundColor = document.querySelector("#highlight_text_input").value;
// });

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

document.addEventListener('focusin', (e) => {
    // console.log(e.target)
    // if(e.target.contentEditable) {
    //     showCardTopBar();
    // } else {
    //     hideCardTopBar();
    // }
});

const vv = window.visualViewport;

let first = true;
function update() {
    const bar = document.querySelector("#card_topbar");
    // if(String(bar.style.height) == "0vh")
    //     return;

    bar.style.transform = `translateY(${vv.offsetTop}px)`;
}

vv.addEventListener("resize", update);
vv.addEventListener("scroll", update);

update();


function inlineMathHover(el, wasClick, remove = false, time = 10e+3, force = false) {
    if (el.className !== "inline_math_friend") return;

    let mathArea = document.querySelector(
        `.math_area[data-owner="${el.dataset.mathId}"]`
    );

    if(remove) {
        if(!mathArea) return;   

        if(el._mathObserver) {
            el._mathObserver.disconnect();
            delete el._mathObserver;
        }

        if(el._mathTimeout) {
            clearTimeout(el._mathTimeout);
            delete el._mathTimeout;
        }

        if(force) {
            mathArea.remove();
        } else {
            mathArea.style.opacity = "0";

            setTimeout(() => {
                mathArea.remove();
            }, 500);
        }

        return;
    }

    // If one already exists, DIE (but later).
    if(mathArea) return;

    if(!el.dataset.mathId ) {
        el.dataset.mathId = Math.random().toString(36).slice(2);
    }

    mathArea = document.createElement("div");
    mathArea.className = "math_area";
    mathArea.dataset.owner = el.dataset.mathId;
    mathArea.style.opacity = "0";

    document.body.appendChild(mathArea);

    function render() {
        mathArea.innerHTML = "";
        mathArea.textContent = (String(el.textContent).split('\\)')[0].replaceAll('\\(', '') + "\\)");
        mathArea.textContent = "\\(" + mathArea.textContent;
        renderMathInElement(mathArea);
        
        const rect = el.getBoundingClientRect();
        const vv = window.visualViewport;
        
        mathArea.style.position = "fixed";
        mathArea.style.left =
            rect.left + rect.width / 2 - mathArea.offsetWidth / 2 + "px";
        
        mathArea.style.top =
            rect.top - mathArea.offsetHeight - 8 + vv.offsetTop + "px";

            // The iOS keyboard sucks

        // mathArea.style.position = "fixed";
        // mathArea.style.left =
        //     rect.left + rect.width / 2 - mathArea.offsetWidth / 2 + "px";
        // mathArea.style.top =
        //     rect.top - mathArea.offsetHeight - 8 + "px";
    }

    render();

    const updateThePositionPLEASE = () => {render()};

    window.addEventListener("scroll", updateThePositionPLEASE, true);
    window.addEventListener("resize", updateThePositionPLEASE);

    requestAnimationFrame(() => {
        mathArea.style.opacity = "1";
    });

    // REmove old stuff
    if(el._mathObserver) {
        el._mathObserver.disconnect();
        clearTimeout(el._mathTimeout);
    }

    const stopWatching = () => {
        observer.disconnect();
        delete el._mathObserver;
        delete el._mathTimeout;

        inlineMathHover(el, false, true);

        window.removeEventListener("scroll", updateThePositionPLEASE, true);
        window.removeEventListener("resize", updateThePositionPLEASE);
    };

    const resetTimeout = () => {
        clearTimeout(el._mathTimeout);
        el._mathTimeout = setTimeout(stopWatching, time);
    };

    const observer = new MutationObserver(() => {
        // Weird things happen if you try to re-render, so just recrteate it
        inlineMathHover(el, false, true, 10e+3, true);

        requestAnimationFrame(() => {  // This is like my first time using animation frames. 10/10, totally worth it
            inlineMathHover(el, false);
        });
    });

    observer.observe(el, {
        characterData: true,
        childList: true,
        subtree: true
    });

    el._mathObserver = observer;
    resetTimeout();
}

document.addEventListener('click', (e) => {
    inlineMathHover(e.target, true, false);
});

document.addEventListener("input", (e) => {
    const editor = e.target.closest("[contenteditable]");
    if(!editor) return;

    const sel = window.getSelection();
    if(!sel.rangeCount) return;

    let node = sel.anchorNode;
    if(node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    const current = node?.closest(".inline_math_friend");
    if(!current) return;

    if(current === editor.querySelector(".inline_math_friend:last-of-type")) {
        inlineMathHover(current, true, false);
    }
});

function linkify(el) {
    const sel = window.getSelection();
    const activeNode =
        sel && sel.rangeCount
            ? sel.getRangeAt(0).startContainer
            : null;

    const walker = document.createTreeWalker(
        el,
        NodeFilter.SHOW_TEXT
    );

    const urlRegex = /\b(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

    const textNodes = [];

    while(walker.nextNode()) {
        const node = walker.currentNode;

        // DONT BE STUPID
        if(node === activeNode) continue;

        if(urlRegex.test(node.textContent)) {
            textNodes.push(node);
        }

        urlRegex.lastIndex = 0;
    }

    for(const node of textNodes) {
        const frag = document.createDocumentFragment();

        let last = 0;
        node.textContent.replace(urlRegex, (url, _, index) => {
            if(index > last) {
                frag.append(node.textContent.slice(last, index));
            }

            const a = document.createElement("a");
            a.href = url.startsWith("http") ? url : `https://${url}`;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = url;
            frag.append(a);

            last = index + url.length;
        });

        if(last < node.textContent.length) {
            frag.append(node.textContent.slice(last));
        }

        node.replaceWith(frag);
    }
}

function updatePlaceholder(el) {
    const hasText = el.textContent.trim() !== "";
    const hasContent = hasText || el.querySelector("img, video, canvas, svg, iframe, embed, object");

    el.classList.toggle("is-empty", !hasContent);

    if(hasContent) {
        linkify(el);
    }
}