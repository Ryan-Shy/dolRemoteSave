/*
 * Other Stuff
 */
function AddSaveDiv() {
    if (!createCW()) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const cw = globalThis.cw;
    // we can add all the save menu stuff here
    const saveList = cw.document.getElementById("saveList");
    if (!saveList) {
        return;
    }
    const customOverlayContent = cw.document.getElementById("customOverlayContent");
    if (!customOverlayContent) {
        return;
    }
    //alert("switch to save menu");
    console.log("loading save overlay addon.")
    const newDiv = cw.document.createElement("div")
    newDiv.innerText = "RyanShy Save Menu: ";
    newDiv.setAttribute("id", "ryanshy-save-menu");
    newDiv.style.paddingTop = "6px";
    newDiv.style.paddingLeft = "6px";
    saveList.insertAdjacentElement("afterend", newDiv);

    const menuButton = cw.document.createElement("button");
    menuButton.className = "saveMenuButton";
    menuButton.innerText = "Open Menu";
    menuButton.onclick = OnMenuButtonClick;
    newDiv.appendChild(menuButton);

}

function OnIframeLoad() {
    AddDocumentListener();
}

function SetToast(msg: string) {
    const toastDiv = document.getElementById("ryanshy-toast");
    if (!toastDiv) {
        return;
    }
    toastDiv.innerHTML = msg;
    toastDiv.className = "show"

    setTimeout(function(){toastDiv.className = toastDiv.className.replace("show", "");}, 3000);
}

function OnLoad() {
    // attach login screen handler
    document.getElementById("ryanshy-login-form")?.addEventListener('submit', OnLoginSubmit);
    document.getElementById("ryanshy-change-password-form")?.addEventListener('submit', OnChangePasswordSubmit);

    fillFormFromStorage();
}

function OnDocumentChange(mutationList : MutationRecord[], observer : MutationObserver) {
    if (!createCW()) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const cw = globalThis.cw;
    const cOverlay = cw.document.getElementById("customOverlay");
    if (cOverlay) {
        AddSaveOverlayListener();
    } else {
        RemoveSaveOverlayListener();
    }
    console.log("Doc changed")
    return;
}

function OnCustomOverlayChange(mutationList : MutationRecord[], observer : MutationObserver) {
    if (!createCW()) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const cw = globalThis.cw;
    if (!globalThis.cOverlay) {
        return;
    }
    const cOverlay = globalThis.cOverlay;
    // check if save menu, then call method to add to save menu
    if (!cOverlay.hasAttribute("data-overlay") || cOverlay.getAttribute("data-overlay") !== "saves") {
        return;
    }
    if (cw.document.getElementById("ryanshy-save-menu")) {
        return;
    }
    AddSaveDiv();
}

function AddSaveOverlayListener() {
    if (!createCW()) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const cw = globalThis.cw;
    const cOverlay = cw.document.getElementById("customOverlay");
    if (globalThis.cOverlay && globalThis.cOverlay === cOverlay) {
        return;
    }
    if(!cOverlay) {
        return;
    }
    globalThis.cOverlay = cOverlay;
    // add observer
    const config = {attributes: true, childList: true, subtree: true};
    const observer = new MutationObserver(OnCustomOverlayChange)
    observer.observe(cOverlay, config);
    globalThis.saveObserver = observer;
}

function RemoveSaveOverlayListener() {
    if (!globalThis.cOverlay) {
        return;
    }
    if (!createCW()) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const cw = globalThis.cw;
    const cOverlay = cw.document.getElementById("customOverlay");
    if (cOverlay) {
        if (globalThis.cOverlay !== cOverlay) {
            // update
            delete globalThis.cOverlay;
            globalThis.saveObserver?.disconnect();
            delete globalThis.saveObserver;
            AddSaveOverlayListener();
        } else {
            // still up to date, nothing to do
            return;
        }
    }
    // remove
    delete globalThis.cOverlay;
    globalThis.saveObserver?.disconnect();
    delete globalThis.saveObserver;
}

function AddDocumentListener() {
    if (!createCW()) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const targetNode = globalThis.cw.document;
    const config = {attributes: true, childList: true, subtree: true};
    const observer = new MutationObserver(OnDocumentChange);
    observer.observe(targetNode, config);
}

function createCW() : boolean {
    if (globalThis.cw) {
        return true;
    }
    const dolEmbedded = document.getElementById("dolEmbedded") as HTMLIFrameElement;
    if (!dolEmbedded) {
        return false;
    }

    const cw = dolEmbedded.contentWindow;
    if (!cw) {
        return false;
    }
    globalThis.cw = cw;
    return true;
}

function main() {
    createCW();
    const dolEmbedded = document.getElementById("dolEmbedded") as HTMLIFrameElement;
    if (!dolEmbedded) {
        return false;
    }
    dolEmbedded.onload = OnIframeLoad;

    window.onload = OnLoad;
}

main();
