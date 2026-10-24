const MAX_RECENT_COUNT = 10;

let inited = false;
let db 
    // : IDBDatabase 
    = null;

let list = [
    
];

async function initRecentlyViewed(data) {
    return new Promise((resolve, reject) => {
        if(!window.indexedDB) {
            resolve(false); // Not supported
            return false;  
        } 
    
        const request = window.indexedDB.open("RecentlyViewed", 3);
        request.onerror = () => {
            resolve(false);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            db.createObjectStore("data", { keyPath: "id" });
        };
        request.onsuccess = (e) => {
            db = e.target.result;
            
            db.onerror = (event) => {
                console.error(`Database error: ${event.target.error?.message}`);
            };

            if(!localStorage.getItem("recentSetIds")) // Use LocalStorage for IDs as its more so designed for that; risk of desync is min
                localStorage.setItem("recentSetIds", "[]");
        
            list = JSON.parse(localStorage.getItem("recentSetIds"));
        
            inited = true;
            resolve(true);
        };
    
    });
}

async function deleteDataBaseNoInit() {
    localStorage.clear("recentSetIds")
    window.indexedDB.deleteDatabase("RecentlyViewed")
}

async function addSetToRecent(title, theClass, id, blob) {
    if(!inited) return false;

    for(const item of list) {
        if(item.id == id) return false;
    }

    list.unshift({
        title: title,
        class: theClass,
        id: id,
        // blob doesn't go here--even when using indexed.db
    });

    // Max is MAX_RECENT_COUNT
    if(list.length > MAX_RECENT_COUNT) {
        const r = list[list.length - 1];

        removeRecentSetFromIndexed(r.id);
        list.splice(-1, 1);
    }

    localStorage.setItem("recentSetIds", JSON.stringify(list));

    const tx = db.transaction("data", "readwrite");
    const store = tx.objectStore("data");
    store.put({id: id, data: blob});

    return true;
}

async function getRecentCount() {
    if(!inited) return -1;
    return list.length;
}

async function removeRecentSetFromIndexed(id) {
    const request = db.transaction("data", "readwrite").objectStore("data").delete(id);
    request.onerror = () => {
        console.error("AHHH!")
    };

}

async function enumerateRecentIntoDiv(recentlyViewedBox) {
    if(!inited) return [];

    const content = recentlyViewedBox.querySelector(".content");

    const sels = [];

    for(const item of list) {
        const sel = document.createElement('div');
        sel.style.display = "flex";
        sel.style.justifyContent = "space-around";
        
        const title = document.createElement('a');
        title.innerText = item.title || "Untitled Set"; // MUST USE INNERTEXT!
        title.title = item.title;
        title.setAttribute("corenote-set-id", item.id);
        if(title.innerText.length > 50) 
            title.innerText = title.innerText.slice(0, 50) + "...";

        const theClass = document.createElement('span');
        theClass.style.fontStyle = "italic";
        theClass.innerText = item.class; // MUST USE INNERTEXT!
        theClass.title = theClass.title;
        if(theClass.innerText.length > 50) 
            theClass.innerText = theClass.innerText.slice(0, 50) + "...";

        sel.append(title, theClass);

        content.append(sel);
        content.append(document.createElement('hr'));

        sels.push(sel);
    }

    return sels; // return html list
}

async function loadRecent(setId) {
    if(!inited) return;

    // load blob (before zip extraction) from db
    const tx = db.transaction("data", "readwrite");
    const store = tx.objectStore("data");
    const res = store.get(setId);
    res.onsuccess = async (e) => {
        try {
            sessionStorage.setItem('crash_prevention-recent', true);
            const blob = e.target.result.data;
    
            const file = new File([blob], "upload.bin", {
                type: "application/octet-stream"
            });
    
            const fileInput = document.querySelector("#file_input");
            if(fileInput) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
    
                if(showCover)
                    showCover();
            }
        } catch (err) {
            await CoreNote.confirm("An unknown error occurred");
            deleteDataBaseNoInit();
            window.location.href = window.location.href;
        } finally {
            sessionStorage.removeItem('crash_prevention-recent');
        }
    };
    res.onerror = async () => {
        await CoreNote.confirm("An unknown error occurred");
        deleteDataBaseNoInit();
        window.location.href = window.location.href;
    };


    // return that
    
}

// Fixes for next time (ranked from greatest importance to least):
// - MEMORY LEAKS AND CRASHES (though, that could be VSCode Live Server's fault)
// - OLD SETS AREN'T DELETED

// - NOT TESTED
// - YOU CANNOT COMBINE SETS (currently handled by not supporting that)

// CANNOT BE MERGED INTO MAIN YET!