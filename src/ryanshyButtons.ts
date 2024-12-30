/*
 * Button click functions
 */
function OnMenuButtonClick() {
    const dolEmbedded = document.getElementById("dolEmbedded")
    if (!dolEmbedded) {
        return;
    }
    const saveOverlay = document.getElementById("ryanshy-save-overlay");
    if (!saveOverlay) {
        return;
    }
    // show save overlay, block iframe inputs
    saveOverlay.setAttribute("class", "ryanshy-save-overlay-enabled");
    dolEmbedded.style.pointerEvents = "none";
    const greyout = document.getElementById("ryanshy-greyout");
    if (!greyout) {
        return;
    }
    greyout.setAttribute("class", "ryanshy-greyout")
    // reset tab to saves
    OnSavesTabClicked();
}

function OnCloseOverlay() {
    const dolEmbedded = document.getElementById("dolEmbedded")
    // re-enable iframe
    if (dolEmbedded) {
        dolEmbedded.style.pointerEvents = "all";
    } else {
        alert("iframe not found!");
    }

    // close overlay
    const overlay = document.getElementById('ryanshy-save-overlay');
    if (!overlay) {
        alert("overlay not found!");
    } else {
        overlay.setAttribute('class', 'ryanshy-save-overlay-disabled');
    }

    // remove greyout
    const greyout = document.getElementById("ryanshy-greyout");
    if (!greyout) {
        alert("greyout not found!");
    } else {
        greyout.setAttribute('class', 'ryanshy-greyout-disabled');
    }
}
/*
 * Overlay tabs
 */
function OnLoginTabClicked() {
    // disable all panels
    const panels = document.getElementsByClassName("ryanshy-panel-enabled");
    for (const panel of panels) {
        panel.setAttribute("class", "ryanshy-panel-disabled");
    }
    const tabs = document.getElementsByClassName("ryanshy-overlay-tab");
    for (const tab of tabs) {
        tab.removeAttribute("current");
    }
    // enable login panel
    const loginPanel = document.getElementById("ryanshy-login-panel");
    loginPanel?.setAttribute("class", "ryanshy-panel-enabled");
    const loginTab = document.getElementById("ryanshy-overlay-tab-login");
    loginTab?.setAttribute("current","");
}

function OnSavesTabClicked() {
    // disable all panels
    const panels = document.getElementsByClassName("ryanshy-panel-enabled");
    for (const panel of panels) {
        panel.setAttribute("class", "ryanshy-panel-disabled");
    }
    const tabs = document.getElementsByClassName("ryanshy-overlay-tab");
    for (const tab of tabs) {
        tab.removeAttribute("current");
    }
    // enable saves panel
    const savesPanel = document.getElementById("ryanshy-saves-panel");
    savesPanel?.setAttribute("class", "ryanshy-panel-enabled");
    const savesTab = document.getElementById("ryanshy-overlay-tab-saves");
    savesTab?.setAttribute("current","");
    loadTable();
}

function OnSettingsTabClicked() {
    // disable all panels
    const panels = document.getElementsByClassName("ryanshy-panel-enabled");
    for (const panel of panels) {
        panel.setAttribute("class", "ryanshy-panel-disabled");
    }
    const tabs = document.getElementsByClassName("ryanshy-overlay-tab");
    for (const tab of tabs) {
        tab.removeAttribute("current");
    }
    // enable settings panel
    const settingsPanel = document.getElementById("ryanshy-settings-panel");
    settingsPanel?.setAttribute("class", "ryanshy-panel-enabled");
    const settingsTab = document.getElementById("ryanshy-overlay-tab-settings");
    settingsTab?.setAttribute("current","");
}
/*
 * Form submit overrides
 */
async function OnLoginSubmit(event: SubmitEvent) {
    event.preventDefault();

    const serverElement = document.getElementById('ryanshy-server');
    const usernameElement = document.getElementById('ryanshy-username');
    const passwordElement = document.getElementById('ryanshy-password');
    if (!serverElement || !usernameElement || !passwordElement) {
        return;
    }
    const server = (serverElement as HTMLInputElement).value;
    const username = (usernameElement as HTMLInputElement).value;
    const password = (passwordElement as HTMLInputElement).value;

    const credentials = btoa(`${username}:${password}`);
    const remoteStorageInfo: RemoteStorageInfo = {username, credentials, server};

    remoteLogin(remoteStorageInfo);
}

async function OnChangePasswordSubmit(event: SubmitEvent) {
    event.preventDefault();

    // need to be logged in to use, check local storage
    const remoteStorageInfo = getSettings("remoteStorageInfo") as RemoteStorageInfo;
    if (!remoteStorageInfo) {
        console.error("Not logged in yet, cannot change password");
        SetToast("<h2 class=\"red\">Please Login First</h2>");
        return;
    }

    const passwordElement = document.getElementById('ryanshy-new-password');
    if (!passwordElement) {
        return;
    }
    const password = (passwordElement as HTMLInputElement).value;

    await remoteChangePWD(password, remoteStorageInfo, ()=> {
        (passwordElement as HTMLInputElement).value = "";
    });
}