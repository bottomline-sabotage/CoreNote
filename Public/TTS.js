// WARNING: This was stolen from one of my first web projects. Watch out!

var api = "apispeech"

function speakWebText(text) {
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.speak(utterance);
}


// function speakRandomText(text) {
//     let speaker;
//     const rand = rng(1, 8);

//     switch(rand) {
//         case 1:
//             speaker = "UK English Female";
//             break;
//         case 2:
//             speaker = "UK English Male";
//             break;
//         case 3:
//             speaker = "US English Female";
//             break;
//         case 4:
//             speaker = "US English Male";
//             break;
//         default: // cases 5, 6, 7, 8
//             speaker = "US English Male";
//             break;
//     }

//     count++;
//     try {
//         responsiveVoice.speak(text, speaker);

//     } catch (e) {
//         console.error(e);
//         speakWebText();
//     }
// }



// // cancel speech when the page is refreshed
// window.onbeforeunload = function() {
//     responsiveVoice.cancel();
// };


function start() {

    // if(document.getElementById("muted").checked) {
        // if (api === "webspeech") {

        // } else if (api === "apispeech") {
    //         speakRandomText(false)
    //     } else {
    //         speakWebText(false);
    //     }
    // } else {
    //     if (api === "webspeech") {
    //         speakWebText(true);
    //     } else if (api === "apispeech") {
    //         speakRandomText(true)
    //     } else {
    //         speakWebText(true);
    //     }
    // }
}



document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Action to perform when Enter is pressed
        start();
    }
});

// document.getElementById("muted").addEventListener("change", function() {
//     if (this.checked) {
//         // The checkbox is now checked
//         responsiveVoice.cancel();
//         console.log("MUTE");
//         document.getElementById("speaker").innerText = "MUTED";
//     } else {
//         // The checkbox is now unchecked
//         console.log("UNMUTE");

//         const synthesis = window.speechSynthesis;
//         synthesis.cancel();
//         const utterance = new SpeechSynthesisUtterance( document.getElementById('text').innerText);
//         synthesis.speak(utterance);
//         document.getElementById("speaker").innerText = "Browser Default";

//     }
// });

// start();

