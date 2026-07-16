const element = document.createElement('div');
element.style.width = `${document.documentElement.scrollWidth}px`;
element.style.height = `${document.documentElement.scrollHeight}px`;
element.style.position = "fixed";
element.style.zIndex = "999999999999"; 
element.style.pointerEvents = "none";

function updateDimensions() {
    const pageWidth = document.documentElement.scrollWidth;
    const pageHeight = document.documentElement.scrollHeight;
    element.style.width = `${pageWidth}px`;
    element.style.height = `${pageHeight}px`;
}

window.addEventListener("resize", updateDimensions);

let vignetteInterval = null;
let vignetteTimeout = null;

function addVignetteById(id) {
    if(localStorage.getItem("removeScreenEffects") == "true")
        return;
    
    switch(id) {

        // Handle Damage

        case "shot": {
            addVignette("rgba(0, 52, 73, 0.5)", "80px", 250, 500, 175);
            break;
        }

        case "dead": {
            addVignette("rgba(0, 0, 0, 0.57)", "80px", 250);
            break;
        }

        case "gray_dead": {
            addVignette("rgba(41, 41, 41, 0.57)", "80px", 250);
            break;
        }
        
        case "less_dead": {
            addVignette("rgba(0, 0, 0, 0.57)", "40px", 250);
            break;
        }

        case "quick_draw": {
            addVignette("rgba(170, 237, 13, 0.5)", "80px", 250, 500, 175);
            break;
        }

        case "draw": {
            addVignette("rgba(127, 176, 11, 0.2)", "60px", 250, 500, 175);
            break;
        }

        case "kill": {
            addVignette("rgba(255, 255, 255, 0.3)", "50px", 250, 500, 175);
            break;
        }

        case "hit": {
            addVignette("#962929", "50px", 250, 500, 175);
            break;
        }

        case "success": {
            addVignette("rgba(94, 255, 0, 0.25)", "50px", 250, 500, 175);
            break;
        }

        case "bomb": {
            addVignette("rgb(255, 255, 255)", "300px", 500, 1000, 420);
            break;
        }

        // Full Health
        case "3": {
            removeVignette();
            break;
        }

        // 3/4 health
        case "2": {
            addVignette("rgba(150, 41, 41, 0.5)", "110px", 2000, undefined, 2000, 800);
            break;
        }

        // Half Health
        case "1": {
            addVignette("rgba(150, 41, 41, 0.75)", "135px", 2000, undefined, 2000, 800);
            break;
        }

        // Quarter left
        case "0": {
            addVignette("#962929", "160px", 600, undefined, 600, 250);
            break;
        }
    }
}

function removeVignette() {
    try {
        clearInterval(vignetteInterval);
        clearTimeout(vignetteTimeout);
        document.body.removeChild(element);
        element.style.transition = ``;
    } catch (error) {
        // There probalby isnt even a vignette
    }
}
    
function addVignette(color = "#000", thickness = "100px", fadeIn = 500, removalTime = -1, pulsatingInterval = -1, pulsatingBreak = -1) {
    // Remove existing vignette if any
    removeVignette();

    // Use the globally declared `element`
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.left = "0";
    element.style.transition = `box-shadow ${fadeIn}ms ease`;
    element.style.boxShadow = `inset 0 0 0px ${color}`; // Start with no shadow

    // Add to DOM
    document.body.insertBefore(element, document.body.firstChild);

    // Fade-in effect
    if (fadeIn > 0) {
        setTimeout(() => {
            element.style.boxShadow = `inset 0 0 ${thickness} ${color}`;
        }, 50);
    } else {
        element.style.boxShadow = `inset 0 0 ${thickness} ${color}`;
    }

    // Pulsating effect
    if (pulsatingInterval > 0) {
        let firstTime = true;
        let state = true;
        
            vignetteInterval = setInterval(() => {
                element.style.boxShadow = state
                    ? `inset 0 0 ${thickness} ${color}`
                    : `inset 0 0 0px ${color}`;
                state = !state;
            }, pulsatingInterval + pulsatingBreak);
    }

    // Auto-remove after specified time
    if (removalTime > 0) {
        vignetteTimeout = setTimeout(() => {
            removeVignette();
        }, removalTime);
    }
}

