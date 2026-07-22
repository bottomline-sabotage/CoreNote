class CardSet {
    assets = [];
    json = {};
};

const fileInput = document.querySelector("#file_input");
const setTitle = document.querySelector("#set_title");
const setClass = document.querySelector("#set_class");
const totalCards = document.querySelector("#total_cards");
const currentCardI = document.querySelector("#current_card_i");
const currentSegmentI = document.querySelector("#current_segment_i");
const totalSegments = document.querySelector("#total_segments");
const wrongCount = document.querySelector("#wrong_count");
const rightCount = document.querySelector("#right_count");
const rawCardView = document.querySelector("#raw_html");
const difficultyStars = document.querySelector("#card_difficulty");
const hintButton = document.querySelector("#help");
const explanationButton = document.querySelector("#explanation");
const category = document.querySelector("#card_category");
const questionType = document.querySelector("#question_type");
const nextButton = document.querySelector("#next_button");
const previousButton = document.querySelector("#previous_button");
const perfectSegmentCount = document.querySelector("#perfect_segment_count");
const uncreatedSettingsWindow = document.querySelector("#set_settings-uncreated");
const settingsWindow = document.querySelector("#set_settings-creation_page");
const requiredRepetitions = document.querySelector("#perfect_segment_required");
const cover = document.querySelector("#cover");
const commentWindow = document.querySelector("#comment_window");
const commentContent = document.querySelector("#commment_content");
const commentInput = document.querySelector("#comment_input");
const commentButton = document.querySelector("#comment");
const progressBar = document.querySelector("#progress_bar");
const flipButton = document.querySelector("#flip_button");
const ordersList = document.querySelector("#orders_list");
const categoriesList = document.querySelector("#categories_list");
const starButton = document.querySelector("#star");

let cardSet = null;
let cardZip = null;
let cardAssets = {};
let currentIndex = 0;
let currentSegment = 0;
let rightOnes = 0;
let wrongOnes = 0;
let onFront = true;
let currentCard = null;
let includesMath = false;
let autoScroll = -1;
let autoScrollId = 0;
let settings = null;
let isShuffled = false;
let previouslyIncorrectCat = false;
let starCategoryCat = false;

let S_isSegmented = false;
let S_individualLength = 0;
let S_repeatChance = 0;
let S_requiredPercentage = 0;
let S_requiredPerfections = 0;
let S_currentPerfections = 0;
let S_currentLocalIndex = 0;
let S_currentSegment = 0;
let S_segmentCount = 0;
let S_segmentLengths = [];

let answerSorting_missedCards = [];

let cardsBackUp = [];

async function showCover() {
    const title = document.querySelector("#cover-title");
    const description = document.querySelector("#cover-description");
    const classInfo = document.querySelector("#cover-class");
    const unitInfo = document.querySelector("#cover-unit_info");
    const author = document.querySelector("#cover-author");
    const date = document.querySelector("#cover-date");

    cardSet = new CardSet();
    const file = fileInput.files[0];
    if(!file)
        return;

    if(!file.name.endsWith(".corenote")) {
        // AH! LOCAL YOKEL's BOUGHT IT
    }

	try {
		cardZip = await JSZip.loadAsync(file);
	    cardSet.json = JSON.parse(await cardZip.file("data.json").async("string"));	
        for(let i = 0; i < cardSet.json.cards.length; i++) {
            cardSet.json.cards[i].index = i; // Set index
        }
	} catch (err) {
		console.error(err);
		window.alert("Failed to load set. Please upload another.");
        cover.style.cssText = "opacity: 0; padding: 0px; max-height: 0vh;";
        return;
	}
    

    // DO NOT SET INNERHTML HERE FOR THE LOVE OF CHRIST!
    title.textContent = cardSet.json.title;
    description.textContent = cardSet.json.description;
    classInfo.textContent = cardSet.json.class;
    unitInfo.textContent = cardSet.json.unitInfo;
    author.textContent = cardSet.json.creator;
    date.textContent = epochToDate(cardSet.json.generationDate * 1000);

    cover.style.cssText = "opacity: 1; padding: 20px; max-height: 100vh;";
}

function doTTS(text) {
    if(settings.tts)
        speakWebText(text);
}

function setGlobalVariables() {
    window.coreNote = {
        currentIndex: currentIndex,
        onFront: onFront,
        rightOnes: rightOnes,
        wrongOnes: wrongOnes,
        settings: JSON.parse(JSON.stringify(settings)),
        "S_isSegmented": S_isSegmented,
        "S_currentLocalIndex": S_currentLocalIndex,
        "S_currentSegment": S_currentSegment,
        "S_currentPerfections": S_currentPerfections, 
        setCard: (index) => {
            setCard(index);
        }
    };
}

function createSettings() {
    localStorage.setItem(`V_settings-${cardSet.json.id}`, localStorage.getItem(`globalSettings`));
    refreshSettings();
}

function removeSettings() {
    localStorage.removeItem(`V_settings-${cardSet.json.id}`);
    refreshSettings();
}

// Copy and pasting code is what all good men should do :)
function loadSettings() {
    
    // Elements
    const tts = document.querySelector("#settings-tts");
    const autoScrollCheck = document.querySelector("#settings-auto_scroll-check");
    const autoScrollTime = document.querySelector("#settings-auto_scroll-time");
    const autoScrollTimeLabel = document.querySelector("#settings-auto_scroll-time-label");
    const answerSorting = document.querySelector("#settings-answer_sorting");
    const cardShuffle = document.querySelector("#settings-card_shuffle");

    const segmentedStudy = document.querySelector("#settings-segmented_study-enabled");
    const segmentedStudyWindow = document.querySelector("#settings-segmented_study-window");
    const segmentedCount = document.querySelector("#settings-segmented_study-count");
    const segmentedCardRepeat = document.querySelector("#settings-segmented_study-card_repeat");
    const segmentedRequiredScore = document.querySelector("#settings-segmented_study-required_percent");
    const segmentedPercentLabel = document.querySelector("#settings-segmented_study-percent");
    const segmentedRequiredPerfectIterations = document.querySelector("#settings-segmented_study-perfect_iterations");
    
    const cardFlip = document.querySelector("#settings-flip");
    

    // Define Settings in LocalStorage
    const setter = () => {
        tts.checked = settings.tts;
        autoScrollCheck.checked = settings.autoScroll.enabled;
        autoScrollTime.value = settings.autoScroll.time;
        cardFlip.checked = settings.cardFlip;
        if(settings.autoScroll.enabled) {
            autoScrollTimeLabel.style.opacity = "1";
        } else {
            autoScrollTimeLabel.style.opacity = "0";
        }
        // speedrunStudy.checked = settings.speedrunStudy;
        answerSorting.checked = settings.answerSorting;
        cardShuffle.checked = settings.shuffledCards;
        segmentedStudy.checked = settings.segmentedStudying.enabled;
        segmentedCount.value = settings.segmentedStudying.count;
        segmentedCardRepeat.value = settings.segmentedStudying.repeatChance;
        segmentedRequiredScore.value = settings.segmentedStudying.percentRequiredToProceed;
        segmentedRequiredPerfectIterations.value = settings.segmentedStudying.requiredPerfections;

        segmentedPercentLabel.innerHTML = `<b>${segmentedRequiredScore.value}%</b>`;

        if(settings.segmentedStudying.enabled) {
            segmentedStudyWindow.style.opacity = "1";
            segmentedStudyWindow.style.maxHeight = "100vh";
            segmentedStudyWindow.style.padding = "20px";
        } else {
            segmentedStudyWindow.style.maxHeight = "1vh";
            segmentedStudyWindow.style.opacity = "0";
            segmentedStudyWindow.style.padding = "0px";
        }
    };
    setter();

    // Handle on-clicks
    const cleanup = () => {
        localStorage.setItem(`V_settings-${cardSet.json.id}`, JSON.stringify(settings)); // This might be inefficient and weird, but this entire function is. I don't like JS enough to fix it.
        setter();
        refreshSettings();
    };

    tts.onclick = () => {
        doTTS("");
        settings.tts = tts.checked;
        cleanup();
    };
    autoScrollCheck.onclick = () => {
        settings.autoScroll.enabled = autoScrollCheck.checked;
        cleanup();
    };
    autoScrollTime.addEventListener('change', (e) => {
        if(parseFloat(autoScrollTime.value) < 0) 
            autoScrollTime.value = 0;

        settings.autoScroll.time = parseFloat(autoScrollTime.value);
        cleanup();
    });
    answerSorting.onclick = () => {
        settings.answerSorting = answerSorting.checked;
        if(!answerSorting.checked && segmentedStudy.checked) { // Segmented studying needs answer sorting
            sendNotification("Segmented Studying requires Answer Sorting to be enabled.<br>To use Segmented Studying, enable Answer Sorting.", 5e+3);
            segmentedStudy.checked = false;
            segmentedStudy.onclick();
        }
        cleanup();  
    };
    
    cardFlip.onclick = () => {
                settings.cardFlip = cardFlip.checked;
                cleanup();
            };
    cardShuffle.onclick = () => {
        settings.shuffledCards = cardShuffle.checked;
        cleanup();
    };
    segmentedStudy.onclick = () => {
        if(!answerSorting.checked && segmentedStudy.checked) {
            answerSorting.checked = true;
            settings.answerSorting = true;
        }
        settings.segmentedStudying.enabled = segmentedStudy.checked;
        cleanup();
    }

    segmentedCount.addEventListener('change', (e) => {
        if(parseInt(segmentedCount.value) < 0) 
            segmentedCount.value = 0;

        segmentedCount.value = parseInt(segmentedCount.value);

        settings.segmentedStudying.count = parseInt(segmentedCount.value);
        cleanup();
    });
    segmentedCardRepeat.addEventListener('change', (e) => {
        if(parseFloat(segmentedCardRepeat.value) < 0) 
            segmentedCardRepeat.value = 0;
        if(parseFloat(segmentedCardRepeat.value) > 100) 
            segmentedCardRepeat.value = 100;

        settings.segmentedStudying.repeatChance = parseFloat(segmentedCardRepeat.value);
        cleanup();
    });
    segmentedRequiredScore.addEventListener('change', (e) => {
        if(parseFloat(segmentedRequiredScore.value) < 0) 
            segmentedRequiredScore.value = 0;
        if(parseFloat(segmentedRequiredScore.value) > 100) 
            segmentedRequiredScore.value = 100;

        settings.segmentedStudying.percentRequiredToProceed = parseFloat(segmentedRequiredScore.value);
        cleanup();
    });
    segmentedRequiredPerfectIterations.addEventListener('change', (e) => {
        if(parseInt(segmentedRequiredPerfectIterations.value) < 1) 
            segmentedRequiredPerfectIterations.value = 1;

        segmentedRequiredPerfectIterations.value = parseInt(segmentedRequiredPerfectIterations.value);

        settings.segmentedStudying.requiredPerfections = parseInt(segmentedRequiredPerfectIterations.value);
        cleanup();
    });
}

function refreshSettings() {
    if(localStorage.getItem(`V_settings-${cardSet.json.id}`)) {
        settingsWindow.style.opacity = "1";
        settingsWindow.style.maxHeight = "100vh";
        uncreatedSettingsWindow.style.maxHeight = "0vh";
        uncreatedSettingsWindow.style.opacity = "0";
        settings = JSON.parse(localStorage.getItem(`V_settings-${cardSet.json.id}`));
        settings.disableSetAssets = JSON.parse(localStorage.getItem("globalSettings")).disableSetAssets;
        settings.motionControls = JSON.parse(localStorage.getItem("globalSettings")).disableSetAssets;
        loadSettings();
    } else {
        settings = JSON.parse(localStorage.getItem("globalSettings"))
        settingsWindow.style.maxHeight = "0vh";
        settingsWindow.style.opacity = "0";
        uncreatedSettingsWindow.style.opacity = "1";
        uncreatedSettingsWindow.style.maxHeight = "100vh";
    }

    if(settings.shuffledCards && !isShuffled) {
        shuffle();
    } else if(!settings.shuffledCards && isShuffled) {
        unshuffle();
    }

    if(!settings.autoScroll.enabled) {
        autoScroll = -1;
    } else if(settings.autoScroll.time > 0) {
        if(autoScroll != settings.autoScroll.time) {
            autoScroll = settings.autoScroll.time;
            createTimeoutInterval();
        }
    }

    if(settings.segmentedStudying.enabled && (!S_isSegmented || settings.segmentedStudying.count != S_individualLength || settings.segmentedStudying.repeatChance != S_repeatChance * 100 || settings.segmentedStudying.percentRequiredToProceed  != S_requiredPercentage * 100 || settings.segmentedStudying.requiredPerfections != S_requiredPerfections)) {
        segmify(settings.segmentedStudying.count, settings.segmentedStudying.repeatChance, settings.segmentedStudying.percentRequiredToProceed, settings.segmentedStudying.requiredPerfections);
    } else if(!settings.segmentedStudying.enabled && S_isSegmented) {
        unsegmify();
    }

    if(settings.answerSorting) {
        document.querySelector("#wrong_button").style.display = "inline";
        document.querySelector("#right_button").style.display = "inline";
        nextButton.style.display = "none";
        previousButton.style.display = "none";
        wrongCount.style.opacity = 1;
        rightCount.style.opacity = 1;
    } else {
        document.querySelector("#wrong_button").style.display = "none";
        document.querySelector("#right_button").style.display = "none";
        nextButton.style.display = "inline";
        previousButton.style.display = "inline";
        wrongCount.style.opacity = 0;
        rightCount.style.opacity = 0;
    }
}

async function load() {
    cardAssets = {};
    
    if(!cardZip)
        return;

    if(localStorage.getItem(`V_settings-${cardSet.json.id}`)) {
        settings = JSON.parse(localStorage.getItem(`V_settings-${cardSet.json.id}`));
    } else {
        settings = JSON.parse(localStorage.getItem("globalSettings"))
    }

    
    if(!JSON.parse(localStorage.getItem("globalSettings")).disableSetAssets) {
        for(const file of Object.values(cardZip.files)) {
            if(file.dir || !String(file.name).startsWith("Assets/")) 
                continue;
            const id = `#${String(file.name).replaceAll('/', '-_-').replaceAll('\\', '-_-').replaceAll('.', "\\.")}`;
            // document.querySelectorAll(id).forEach(async (el) => {
            cardAssets[id] = URL.createObjectURL(await file.async("blob")); // FIXME: ram crash?
            // });
        }
    }
	
	refreshSettings(); // Done after disabling set assets
	initCardSet();
}

let glowWrongTimeout;
let glowRightTimeout;

function markWrong() {
    if(glowWrongTimeout)
        clearTimeout(glowWrongTimeout);
    wrongOnes++;
    wrongCount.textContent = wrongOnes;
    wrongCount.style.color = "red";
	wrongCount.style.transform = "scale(1.5)";
    glowWrongTimeout = setTimeout(() => {
        wrongCount.style.color = "black";
		wrongCount.style.transform = "";
    }, 2e+3);
	
    if(!answerSorting_missedCards.includes(currentCard.index))
	    answerSorting_missedCards.push(currentCard.index);
}

function markRight() {
    if(glowRightTimeout)
        clearTimeout(glowRightTimeout);
    rightOnes++;
    rightCount.textContent = rightOnes;
    rightCount.style.color = "green";
	rightCount.style.transform = "scale(1.5)";
    glowRightTimeout = setTimeout(() => {
        rightCount.style.color = "black";
		rightCount.style.transform = "";
    }, 2e+3);
	
	for(let i = 0; i < answerSorting_missedCards.length; i++) {
		
		if(answerSorting_missedCards[i] == currentCard.index) {
			answerSorting_missedCards.splice(i, 1);
			break;
		}
	}
}
 
function initCardSet() {

    wrongCount.textContent = rightOnes;
    rightCount.textContent = wrongOnes;
    setTitle.textContent = cardSet.json.title;
    setTitle.title = cardSet.json.id;
    setClass.textContent = cardSet.json.class;
    currentCardI.textContent = currentIndex + 1;
    // document.querySelector("#set_desc").textContent = cardSet.json.description || "";

    if(!S_isSegmented) {
        totalCards.textContent = cardSet.json.cards.length;
        totalSegments.textContent = "∞";
        currentSegmentI.textContent = "∞";
        // nextButton.style.display = "inline";
        // previousButton.style.display = "inline";
    } else {
        totalCards.textContent = S_segmentLengths[0];
        totalSegments.textContent = S_segmentCount;
        currentSegmentI.textContent = 1;
        // nextButton.style.display = "none";
        // previousButton.style.display = "none";
    }

    // Load set info
    {
        document.querySelector("#info-title").innerHTML = cardSet.json.title || "<i>Undefined</i>";
        // document.querySelector("#info-desc").innerHTML = cardSet.json.description || "<i>Undefined</i>";
        document.querySelector("#info-num_cards").innerHTML = cardSet.json.cards.length || "<i>Undefined</i>";
        if(cardSet.json.categories.length > 0) {
            document.querySelector("#info-categories").innerHTML = cardSet.json.categories.join(' | ') || "<i>Undefined</i>";
        } else {
            document.querySelector("#info-categories").innerHTML = "<i>None</i>";
        }
        // if(cardSet.json.orders.length > 0) {
        //     document.querySelector("#info-orders").innerHTML = cardSet.json.orderNames || "<i>Undefined</i>";
        // } else {
        //     document.querySelector("#info-orders").innerHTML = "<i>None</i>";
        // }
        document.querySelector("#info-author").innerHTML = cardSet.json.creator || "<i>Undefined</i>";

        switch(parseInt(cardSet.json.version)) {
            case 0:
                document.querySelector("#info-version").innerHTML = `0 <span class="note">(InDev)</span>`;
                break;
            case 1: 
                document.querySelector("#info-version").innerHTML = `1 <span class="note">(Sunshine)</span>`;
                break;
            case NaN: 
                document.querySelector("#info-version").innerHTML = `<i>Undefined</i>`;
                break;
            default:
                console.warn("No version identifier for version " + cardSet.json.version)
                document.querySelector("#info-version").innerHTML = `${cardSet.json.version} <span class="note">(?)</span>`;
                break;

        }
        
        document.querySelector("#info-date").innerHTML = epochToDate(cardSet.json.generationDate * 1000) || "<i>Undefined</i>";
        document.querySelector("#info-class").innerHTML = cardSet.json.class || "<i>Undefined</i>";
        document.querySelector("#info-unit_info").innerHTML = cardSet.json.unitInfo || "<i>Undefined</i>";
        document.querySelector("#info-id").innerHTML = cardSet.json.id || "<i>Undefined</i>";
        document.querySelector("#info-desc").innerHTML = cardSet.json.description;
        
        if(!localStorage.getItem(`V_times-${cardSet.json.id}`)) {
            document.querySelector("#info-study_times").innerHTML = 0;
            localStorage.setItem(`V_times-${cardSet.json.id}`, 1);
        } else {
            const times = parseInt(localStorage.getItem(`V_times-${cardSet.json.id}`));
            localStorage.setItem(`V_times-${cardSet.json.id}`, times + 1);
            document.querySelector("#info-study_times").innerHTML = times;
        }
    }

    // const orders = structuredClone(cardSet.json.orderNames);
    const categories = structuredClone(cardSet.json.categories);

    // orders.unshift("None");

    categories.unshift("Starred");
    categories.unshift("Previously Marked Incorrect");
    categories.unshift("None");

    // for(const [index, order] of orders.entries()) {
    //     const btn = document.createElement('button');
    //     btn.className = "order_buttons ";
    //     if(index != 0) {
    //         btn.className += " deactivated_button";
    //     }
    //     btn.textContent = order;
    //     btn.onclick = () => {
	// 		goOrder(index - 1);
    //         document.querySelector("#current_order").textContent = order;
    //         if(index - 1 != -1) {
    //             // sendNotification(`Switching to order "${order}"`, 1.5e+3);
    //         } else {
    //             // sendNotification(`Using no order`, 1.5e+3);
    //         }
    //         document.querySelectorAll(".order_buttons").forEach((el) => {
    //             el.className = "deactivated_button order_buttons";
    //         });
    //         btn.className = "order_buttons";
    //     }

    //     ordersList.appendChild(btn);
    //     if(index == 0) {
    //         ordersList.appendChild(document.createElement('br'));
    //     }
    //     ordersList.appendChild(document.createElement('br'));
    // }
    for(const [index, category] of categories.entries()) {
        const btn = document.createElement('button');
        btn.className = "category_buttons";
        if(index != 0) {
            btn.className += " deactivated_button";
        }
        btn.textContent = category;
        btn.onclick = () => {
			goCategory(index - 3);
            document.querySelector("#current_category").textContent = category;
            if(index  != 0) {
                // sendNotification(`Switching to category "${category}"`, 1.5e+3);
            } else {
                // sendNotification(`Using no category`, 1.5e+3);
            }
            document.querySelectorAll(".category_buttons").forEach((el) => {
                el.className = "category_buttons deactivated_button";
            });
            btn.className = "category_buttons";
        }

        categoriesList.appendChild(btn);
        if(index == 2) {
            categoriesList.appendChild(document.createElement('hr'));
        } else 
            categoriesList.appendChild(document.createElement('br'));
    }

    setCard(currentIndex);
	cardsBackUp = structuredClone(cardSet.json.cards);
    
}

let intervalLock = false; // note: this is a hack to fix old code
async function createTimeoutInterval() {
    while(intervalLock)
        await sleep(500);

    autoScrollId++;
    const AUTO_SCROLL_ID = autoScrollId;

    while(autoScroll > 0 && settings.autoScroll.enabled && autoScrollId == AUTO_SCROLL_ID) {
        intervalLock = true;

        await sleep(autoScroll * 1000);
        flip();
        await sleep(autoScroll * 1000);
        if(S_isSegmented) {
            markRight();
        }
        next();
    }

    intervalLock = false;
}

function setCard(index) {
    onFront = true;

    currentCard = cardSet.json.cards[index];

    if(!currentCard) {
        console.error("Failed to load card at index " + index + ". Possibly out-of-bounds."); 
        return;
    }
    currentIndex = index;

    showCard();

    if(!S_isSegmented) {
        progressBar.style.width = `${((currentIndex + 1) / cardSet.json.cards.length) * 100}%`
        currentCardI.textContent = currentIndex + 1;
    } else {
        progressBar.style.width = `${((S_currentLocalIndex + 1) / S_segmentLengths[S_currentSegment]) * 100}%`
        currentCardI.textContent = S_currentLocalIndex + 1;

    }


}

function showHelpPopup(text) {
    window.alert(text);
}

function showCard() {
    let innerHTML = currentCard.front;

    let ourFront = onFront;
    if(settings.cardFlip) {
        ourFront = !ourFront;
    }
    
    // Pick card side
    if(ourFront) {
        innerHTML = currentCard.front;
    } else {
        innerHTML = currentCard.back;
    }
    
    // If randomized front, do that
    if(ourFront && currentCard.randomizedFront) {
        innerHTML = innerHTML[rng(0, innerHTML.length - 1)]
    }

    // Handle explanations
    if(currentCard.explanation && !onFront) 
        explanationButton.style.display = "inline";
    else 
        explanationButton.style.display = "none";
    // Handle hints 
    if(currentCard.hint && onFront) 
        hintButton.style.display = "inline";
    else 
        hintButton.style.display = "none";

    // Stars
    let stars = "";
    for(let i = 0; i < Math.floor(currentCard.difficultyWeight); i++) {
        stars += "★";
    }
    if(Math.floor(currentCard.difficultyWeight) != currentCard.difficultyWeight) {
        stars += '☆';
    }
    stars += ` ${Number(currentCard.difficultyWeight).toFixed(1)}/5 `;

    difficultyStars.innerHTML = stars;

    // Category
    category.textContent = cardSet.json.categories[currentCard.category];
    
    // Handle global variables
    if(window?.coreNote?.onunload) {
        try {
            window.coreNote.onunload();
        } catch(err) {
            console.error("Error from CoreNote API: " + err);
        }
    }
    setGlobalVariables();
    
    // Comments
    let comments = null;
    const commentStr = localStorage.getItem(`V_comments-${cardSet.json.id}`);
    if(commentStr) {
        comments = JSON.parse(commentStr);
        if(comments[currentCard.index]) {
            commentWindow.style.display = "inline";
            commentContent.innerHTML = comments[currentCard.index];
        } else {
            commentWindow.style.display = "none";
        }
    }
    
    // Set innerHTML
    rawCardView.innerHTML = innerHTML;

    // Asset rendering
    for(const [key, src] of Object.entries(cardAssets)) {
        document.querySelectorAll(key).forEach(async (el) => {
            el.src = src;
        });
    }
	
	// Wrong previously reminder
	// window.alert(JSON.stringify(answerSorting_missedCards));
	const wrongAnswerReminder = document.querySelector("#wrong_answer");
	if(settings.answerSorting && answerSorting_missedCards.includes(currentCard.index)) {
		wrongAnswerReminder.style.opacity = 1;
	} else {
		wrongAnswerReminder.style.opacity = 0;
	}
    
    // Render math
    if(renderMathInElement)
        renderMathInElement(rawCardView); //
    else 
        console.error("Failed to render math (renderMathInElement doesn't exist");

    // TTS (setting queried later)
    if(String(innerHTML).includes("\\("))
        doTTS("");
    else {
        if(comments && comments[currentCard.index] && ourFront) {
            doTTS(rawCardView.textContent + ". Comment: " + comments[currentCard.index]);
        } else {
            doTTS(rawCardView.textContent);
        }
    }
	
	// Star
	{
		let stars = [];
		if(localStorage.getItem(`V_stars-${cardSet.json.id}`)) {
			try {
				stars = JSON.parse(localStorage.getItem(`V_stars-${cardSet.json.id}`));	
			} catch (err) {
				console.error(err);
			}
		}
		
		if(stars.includes(currentCard.index)) {
			starButton.style.color = "red";
		} else {
			starButton.style.color = "black";
		}
			
	}
    
    // Chance to add to homepage subtitle pool
    if(rng(0, 50) == 0 && rawCardView.textContent.length <= 40) {
        let arr = [];
        if(localStorage.getItem("subtitles")) {
            arr = JSON.parse(localStorage.getItem("subtitles"));
        }
        
        if(!arr.includes(rawCardView.textContent))
            arr.push(rawCardView.textContent);
        
        localStorage.setItem("subtitles", JSON.stringify(arr));
    }
}

let flipButtonTimeout = null;

function flip() {
    onFront = !onFront;
		
	if(flipButtonTimeout)
		clearTimeout(flipButtonTimeout);
	
	if(onFront) {
		flipButton.textContent = "Now On Front";
	} else {
		flipButton.textContent = "Now On Back";
	}
	
	
	flipButtonTimeout = setTimeout(() => {
		flipButton.textContent = "Flip";
	}, 1.5e+3);

    showCard();
}

function itsOver() {
	console.log("ITS OVER!");
	
	addVignetteById('bomb'); // Vignette -> possibly way too bright and annoying

    currentIndex = 0;
    currentSegment = 0;
    rightOnes = 0;
    wrongOnes = 0;

    wrongCount.textContent = 0;
    rightCount.textContent = 0;
    setTitle.textContent = cardSet.json.title;
    setTitle.title = cardSet.json.id;
    setClass.textContent = cardSet.json.class;
    currentCardI.textContent = 1;
    if(!S_isSegmented) {
        totalCards.textContent = cardSet.json.cards.length;
        totalSegments.textContent = "∞";
        currentSegmentI.textContent = "∞";
        // nextButton.style.display = "inline";
        // previousButton.style.display = "inline";
    } else {
        totalCards.textContent = S_segmentLengths[0];
        totalSegments.textContent = S_segmentCount;
        currentSegmentI.textContent = 1;
        // nextButton.style.display = "none";
        // previousButton.style.display = "none";
    }

    if(settings.shuffledCards) {
        shuffle(false);
    }
	

    // Refresh ud categories
	if(previouslyIncorrectCat) {
		previouslyIncorrect()
	}
    if(starCategoryCat) {
        starCategory();
    }

    setCard(0);
}

function next() {
    if(!S_isSegmented) {
        currentIndex++;
        if(currentIndex >= cardSet.json.cards.length) {
            itsOver();
            // TODO: when shuffled cards, shuffle the cards
            currentIndex = 0;
        }
        setCard(currentIndex);
        return;
    }
    
    // Segmented

    S_currentLocalIndex++;
    // If done with segment
    if(S_currentLocalIndex >= S_segmentLengths[S_currentSegment]) {        

        // Perfection :)
        if(S_segmentLengths[S_currentSegment] > 0 && rightOnes / S_segmentLengths[S_currentSegment]) {
            addVignetteById("success");
            S_currentPerfections++;
        } 
        // GOD**** FAILURE!
        else {
            S_currentPerfections = 0;
            addVignetteById("hit");
        }

        // Next segment por favor, señor
        if(S_currentPerfections >= S_requiredPerfections) {
            S_currentPerfections = 0;
            S_currentSegment++;
            totalCards.textContent = S_segmentLengths[S_currentSegment];
            currentSegmentI.textContent = S_currentSegment + 1;
        }

        // ITS OVER
        if(S_currentSegment >= S_segmentCount) {
            S_currentPerfections = 0;
            S_currentSegment = 0;
            itsOver();

        }

        S_currentLocalIndex = 0;
        rightOnes = 0;
        wrongOnes = 0;
        rightCount.textContent = 0;
        wrongCount.textContent = 0;

        perfectSegmentCount.textContent = S_currentPerfections;

        if(settings.shuffledCards)
            randomizeSubArray(cardSet.json.cards, S_currentLocalIndex + (S_currentSegment * S_individualLength), S_segmentLengths[S_currentSegment]);
    }

    setCard(S_currentLocalIndex + (S_currentSegment * S_individualLength)); // FIXME: last segment isnt guarnteed to be sized that way
}

function previous() {
    if(!S_isSegmented) {
        currentIndex--;
        if(currentIndex < 0) {
            currentIndex = cardSet.json.cards.length - 1;
        }
        setCard(currentIndex)
        return;
    }

    setCard(currentIndex)
}

function star() {
    let stars = [];
	if(localStorage.getItem(`V_stars-${cardSet.json.id}`)) {
		try {
			stars = JSON.parse(localStorage.getItem(`V_stars-${cardSet.json.id}`));	
		} catch (err) {
			console.error(err);
		}
	}
	
	if(stars.includes(currentCard.index)) {
		for(let i = 0; i < stars.length; i++) {
			if(stars[i] == currentCard.index) {
				stars.splice(i, 1);
				starButton.style.color = "black";
				break;
			}
		}
		
	} else {
		stars.push(currentCard.index);
		starButton.style.color = "red";
	}
	
	localStorage.setItem(`V_stars-${cardSet.json.id}`, JSON.stringify(stars));
}

function help() {
    showHelpPopup(currentCard.hint);
}

function explanation() {
    showHelpPopup(currentCard.explanation);
}

function comment() {
    // isCommenting = false;

    let comments = {};
    if(localStorage.getItem(`V_comments-${cardSet.json.id}`)) {
        comments = JSON.parse(localStorage.getItem(`V_comments-${cardSet.json.id}`));
    }
    const commentingStr = window.prompt("Enter your comment (leave blank to remove any current comment)");


    if(commentingStr.trim().length == "") {
        delete comments[currentCard.index];
        commentWindow.style.display = "none";
        commentContent.innerHTML = comments[currentCard.index];
    } else {
        comments[currentCard.index] = commentingStr;
        commentWindow.style.display = "inline";
        commentContent.innerHTML = comments[currentCard.index];
    }

    commentButton.innerHTML = "Comment";

    localStorage.setItem(`V_comments-${cardSet.json.id}`, JSON.stringify(comments));


}

function previouslyIncorrect() {
	if(!settings.answerSorting) {
		sendNotification("Nope. Enable Answer Sorting", 3.5e+3);
        cardSet.json.cards = structuredClone(cardsBackUp);
		if(settings.shuffledCards)
			shuffle();
		setCard(0);
		showCard();
		totalCards.textContent = cardSet.json.cards.length;
        previouslyIncorrectCat = false;
        throw new Error("Denied!");
	}
	
	if(!answerSorting_missedCards || answerSorting_missedCards.length <= 0) {
        cardSet.json.cards = structuredClone(cardsBackUp);
		// sendNotification("Cannot review by incorrect cards; there are none.", 3e+3); // they will miss some later
		if(settings.shuffledCards)
			shuffle();
		setCard(0);
		showCard();
		totalCards.textContent = cardSet.json.cards.length;
		// throw new Error("Denied!");
        return;
	}
	
	for(let i = cardSet.json.cards.length - 1; i >= 0; i--) {
		if(!answerSorting_missedCards.includes(cardSet.json.cards[i].index)) {
			cardSet.json.cards.splice(i, 1);
		}
	}
	
	if(settings.shuffledCards)
		shuffle();
	setCard(0);
	showCard();
	totalCards.textContent = cardSet.json.cards.length;
}

function starCategory() {
    let stars = [];
    if(localStorage.getItem(`V_stars-${cardSet.json.id}`)) {
        try {
            stars = JSON.parse(localStorage.getItem(`V_stars-${cardSet.json.id}`));	
        } catch (err) {
            console.error(err);
        }
    }
    
    if(!stars || stars.length <= 0) {
        sendNotification("Cannot review starred cards; there are none.", 3e+3);
        if(settings.shuffledCards)
            shuffle();
        setCard(0);
        showCard();
        totalCards.textContent = cardSet.json.cards.length;
        throw new Error("Denied!");
    }
    
    for(let i = cardSet.json.cards.length - 1; i >= 0; i--) {
        if(!stars.includes(cardSet.json.cards[i].index)) {
            cardSet.json.cards.splice(i, 1);
        }
    }
    
    
    if(settings.shuffledCards)
        shuffle();
    setCard(0);
    showCard();
    totalCards.textContent = cardSet.json.cards.length;
}

function goCategory(category) {
	cardSet.json.cards = structuredClone(cardsBackUp);
	
	if(category != -2)
		previouslyIncorrectCat = false;
	else {
		previouslyIncorrectCat = true;
	}

    if(category != -1) 
        starCategoryCat = false;
    else 
        starCategoryCat = true;
	
	// None
	if(category == -3) {
		
		if(settings.shuffledCards)
			shuffle();
		setCard(0);
		showCard();
		totalCards.textContent = cardSet.json.cards.length;
		return;	
	}
	
	// Previously incorrect
	if(category == -2) {
		
		previouslyIncorrect();
		return;
	}
	
	// Star
	if(category == -1) {		
		starCategory();
		return;
	}
	
	for(let i = cardSet.json.cards.length - 1; i >= 0; i--) {
		if(cardSet.json.cards[i].category != category)
			cardSet.json.cards.splice(i, 1);
	}
	
	if(settings.shuffledCards)
		shuffle();
	setCard(0);
	showCard();
	totalCards.textContent = cardSet.json.cards.length;
}

function goOrder(order) {
	// cardSet.json.cards = structuredClone(cardsBackUp);
	
}

function shuffle(reset = true) {
    isShuffled = true;
    shuffleArray(cardSet.json.cards)
    if(reset) {
        currentIndex = 0;
        currentSegment = 0;
        rightOnes = 0;
        wrongOnes = 0;
    
        wrongCount.textContent = 0;
        rightCount.textContent = 0;
        setTitle.textContent = cardSet.json.title;
        setTitle.title = cardSet.json.id;
        setClass.textContent = cardSet.json.class;
        currentCardI.textContent = 1;
        if(!S_isSegmented) {
            totalCards.textContent = cardSet.json.cards.length;
            // totalSegments.textContent = "∞";
            // currentSegmentI.textContent = "∞";
            // nextButton.style.display = "inline";
            // previousButton.style.display = "inline";
        } else {
            totalCards.textContent = S_segmentLengths[0];
            totalSegments.textContent = S_segmentCount;
            currentSegmentI.textContent = 1;
            // nextButton.style.display = "none";
            // previousButton.style.display = "none";
        }
    
        setCard(0);
    }
}

function unshuffle() {
    isShuffled = false;
    cardSet.json.cards.sort((a, b) => a.index - b.index);
    currentIndex = 0;
    currentSegment = 0;
    rightOnes = 0;
    wrongOnes = 0;

    wrongCount.textContent = 0;
    rightCount.textContent = 0;
    setTitle.textContent = cardSet.json.title;
    setTitle.title = cardSet.json.id;
    setClass.textContent = cardSet.json.class;
    currentCardI.textContent = 1;
    if(!S_isSegmented) {
        totalCards.textContent = cardSet.json.cards.length;
        // totalSegments.textContent = "∞";
        // currentSegmentI.textContent = "∞";
        // nextButton.style.display = "inline";
        // previousButton.style.display = "inline";
    } else {
        totalCards.textContent = S_segmentLengths[0];
        totalSegments.textContent = S_segmentCount;
        currentSegmentI.textContent = 1;
        // nextButton.style.display = "none";
        // previousButton.style.display = "none";
    }

    setCard(0);
}

function segmify(individualLength, repeatChance100, requiredPercentage100, requiredPerfections) {
    
    if(!individualLength || individualLength < 1)
        return;

    S_isSegmented = true;
    S_individualLength = individualLength;
    S_repeatChance = repeatChance100 / 100;
    S_requiredPercentage = requiredPercentage100 / 100;
    S_requiredPerfections = requiredPerfections;
    S_currentLocalIndex = 0;
    S_currentSegment = 0;
    S_currentPerfections = 0;
    S_segmentCount = Math.ceil(cardSet.json.cards.length / S_individualLength);
    
    S_segmentLengths = [];
    for(let i = 0; i < S_segmentCount - 1; i++)
        S_segmentLengths.push(S_individualLength); // This isn't necessary (and is too verbose), however, this is my 2nd time coding segmented studying. Last time, I was so g-**** tired that my math wasn't mathing (I didn't have coffee). "You can code things in ****ty ways, as long as you justify your bull**** in comments" - Probably Abraham Lincoln

    if(cardSet.json.cards.length % S_individualLength === 0) {
        S_segmentLengths.push(S_individualLength); // Easy math
    } else {
       S_segmentLengths.push(cardSet.json.cards.length - (S_individualLength * (S_segmentCount - 1))); 
    }

    currentIndex = 0;
    currentSegment = 0;
    rightOnes = 0;
    wrongOnes = 0;

    requiredRepetitions.textContent = S_requiredPerfections;
    wrongCount.textContent = 0;
    rightCount.textContent = 0;
    setClass.textContent = cardSet.json.class;
    currentCardI.textContent = 1;
    totalCards.textContent = S_segmentLengths[0];
    totalSegments.textContent = S_segmentCount;
    currentSegmentI.textContent = 1;
    // nextButton.style.display = "none";
    // previousButton.style.display = "none";

    document.querySelector("#div_for_segment_stuff").style.display = "inline";

    setCard(0);
}

function unsegmify() {
    perfectSegmentCount.textContent = 0; // HACK: shouldn't be needed when im hiding that shiz anyways, but that's thursday's problem
    S_isSegmented = false;
    
    currentIndex = 0;
    currentSegment = 0;
    rightOnes = 0;
    wrongOnes = 0;

    wrongCount.textContent = 0;
    rightCount.textContent = 0;
    setTitle.textContent = cardSet.json.title;
    setTitle.title = cardSet.json.id;
    setClass.textContent = cardSet.json.class;
    currentCardI.textContent = 1;

    totalCards.textContent = cardSet.json.cards.length;
    // totalSegments.textContent = "∞";
    // currentSegmentI.textContent = "∞";
    // nextButton.style.display = "inline";
    // previousButton.style.display = "inline";
    
    document.querySelector("#div_for_segment_stuff").style.display = "none";

    setCard(0);
}

function print() {
    const div = document.createElement("div");
    div.innerHTML = `
        <h1>${cardSet.json.title}</h1>$
        <span class="note">In order to print this, use your browser's built-in print button/hotkey.</span>
        <hr>
        <div style="display: flex; align-items: center; justify-content: space-between;"><b>Front</b><b>Back</b></div>
        <hr>
    `;


    for(const card of cardSet.json.cards) {
        

        const cardContent = document.createElement("div");
        cardContent.style.cssText = "display: flex; align-items: center; justify-content: space-between;";

        const front = document.createElement('span');
        front.innerHTML = card.front;

        const back = document.createElement('span');
        back.innerHTML = card.back;

        cardContent.appendChild(front);
        cardContent.appendChild(back);
        
        div.appendChild(cardContent);
        div.appendChild(document.createElement('hr'));
    }

    const pastSubmit = document.querySelector("#past_submit");
    pastSubmit.style.display = "none";
    document.body.appendChild(div);
   
    const back = document.createElement('button');
    back.textContent = "Back";
    back.className = 'no-print';
    back.onclick = () => {
        div.remove();
        pastSubmit.style.display = "inline";
        back.remove();
    }
    document.body.prepend(back);

    // Asset Rendering
    console.log(cardAssets);
    for(const [key, src] of Object.entries(cardAssets)) {
        document.querySelectorAll(key).forEach(async (el) => {
            el.src = src;
            el.style.maxWidth = "175px";
            el.style.maxHeight = "175px";
        });
    }

    // Render math
    if(renderMathInElement)
        renderMathInElement(div);
    else 
        console.error("Failed to render math (renderMathInElement doesn't exist");
}