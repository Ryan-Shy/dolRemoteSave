var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
/*
 * Other Stuff
 */
dolRemoteSave.AddSaveDiv = function () {
    if (!dolRemoteSave.createCW
        || !dolRemoteSave.createCW()
        || !dolRemoteSave.buttons?.OnMenuButtonClick) {
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
    menuButton.onclick = dolRemoteSave.buttons.OnMenuButtonClick;
    newDiv.appendChild(menuButton);

}

dolRemoteSave.OnIframeLoad = function () {
    if (dolRemoteSave.AddDocumentListener) {
        dolRemoteSave.AddDocumentListener();
    }
}

dolRemoteSave.SetToast = function (msg: string) {
    const toastDiv = document.getElementById("ryanshy-toast");
    if (!toastDiv) {
        return;
    }
    toastDiv.innerHTML = msg;
    toastDiv.className = "show"

    setTimeout(function(){toastDiv.className = toastDiv.className.replace("show", "");}, 3000);
}

dolRemoteSave.OnLoad = function() {
    // attach login screen handler
    document.getElementById("ryanshy-login-form")?.addEventListener('submit', dolRemoteSave.buttons?.OnLoginSubmit ?? ((event)=>{event.preventDefault();}));
    document.getElementById("ryanshy-change-password-form")?.addEventListener('submit', dolRemoteSave.buttons?.OnChangePasswordSubmit ?? ((event)=>{event.preventDefault();}));

    if (dolRemoteSave.localStorage?.fillFormFromStorage) {
        dolRemoteSave.localStorage.fillFormFromStorage();
    }
}

dolRemoteSave.OnDocumentChange = function (mutationList : MutationRecord[], observer : MutationObserver) {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const cw = globalThis.cw;
    const cOverlay = cw.document.getElementById("customOverlay");
    if (cOverlay) {
        if (dolRemoteSave.AddSaveOverlayListener) {
            dolRemoteSave.AddSaveOverlayListener();
        }
    } else {
        if (dolRemoteSave.RemoveSaveOverlayListener) {
            dolRemoteSave.RemoveSaveOverlayListener();
        }
    }
    console.log("Doc changed")
    return;
}

dolRemoteSave.OnCustomOverlayChange = function (mutationList : MutationRecord[], observer : MutationObserver) {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
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
    if (dolRemoteSave.AddSaveDiv) {
        dolRemoteSave.AddSaveDiv();
    }
}

dolRemoteSave.AddSaveOverlayListener = function () {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
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
    const observer = new MutationObserver(dolRemoteSave?.OnCustomOverlayChange ?? (()=>{}));
    observer.observe(cOverlay, config);
    globalThis.saveObserver = observer;
}

dolRemoteSave.RemoveSaveOverlayListener = function() {
    if (!globalThis.cOverlay) {
        return;
    }
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
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
            if (dolRemoteSave.AddSaveOverlayListener) {
                dolRemoteSave.AddSaveOverlayListener();
            }
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

dolRemoteSave.AddDocumentListener = function () {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
        return;
    }
    if (!globalThis.cw) {
        return;
    }
    const targetNode = globalThis.cw.document;
    const config = {attributes: true, childList: true, subtree: true};
    const observer = new MutationObserver(dolRemoteSave?.OnDocumentChange ?? (()=>{}));
    observer.observe(targetNode, config);
}

dolRemoteSave.createCW = function () : boolean {
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

dolRemoteSave.main = function () {
    if (!dolRemoteSave.createCW) return;
    dolRemoteSave.createCW();
    const dolEmbedded = document.getElementById("dolEmbedded") as HTMLIFrameElement;
    if (!dolEmbedded) {
        return false;
    }
    dolEmbedded.addEventListener("load", dolRemoteSave?.OnIframeLoad ?? (()=>{}), false);

    window.addEventListener("load", dolRemoteSave?.OnLoad ?? (()=>{}), false);
}

dolRemoteSave.main();
