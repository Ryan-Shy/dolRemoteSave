var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
dolRemoteSave.buttons = dolRemoteSave.buttons ?? {};
/*
 * Button click functions
 */
dolRemoteSave.buttons.OnMenuButtonClick = function () {
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
    if (dolRemoteSave.buttons?.OnSavesTabClicked) {
        dolRemoteSave.buttons.OnSavesTabClicked();
    }
}

dolRemoteSave.buttons.OnCloseOverlay = function () {
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

    // disable all panels
    const panels = document.getElementsByClassName("ryanshy-panel-enabled");
    for (const panel of panels) {
        panel.setAttribute("class", "ryanshy-panel-disabled");
    }

    // remove greyout
    const greyout = document.getElementById("ryanshy-greyout");
    if (!greyout) {
        alert("greyout not found!");
    } else {
        greyout.setAttribute('class', 'ryanshy-greyout-disabled');
    }

    // clear table
    if (dolRemoteSave.saveTable?.clearTable) {
        dolRemoteSave.saveTable.clearTable();
    }
}
/*
 * Overlay tabs
 */
dolRemoteSave.buttons.OnLoginTabClicked = function () {
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

dolRemoteSave.buttons.OnSavesTabClicked = function () {
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
    if (dolRemoteSave.saveTable?.loadTable) {
        dolRemoteSave.saveTable.loadTable();
    }
}

dolRemoteSave.buttons.OnSettingsTabClicked = function () {
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
dolRemoteSave.buttons.OnLoginSubmit = async function (event: SubmitEvent) {
    event.preventDefault();

    if (!dolRemoteSave.remoteStorage?.remoteLogin) {
        return;
    }

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

    dolRemoteSave.remoteStorage.remoteLogin(remoteStorageInfo);
}

dolRemoteSave.buttons.OnChangePasswordSubmit = async function (event: SubmitEvent) {
    event.preventDefault();

    if (!dolRemoteSave.SetToast
        || !dolRemoteSave.localStorage?.getSettings
        || !dolRemoteSave.remoteStorage?.remoteChangePWD) {
        return;
    }

    // need to be logged in to use, check local storage
    const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
    if (!remoteStorageInfo) {
        console.error("Not logged in yet, cannot change password");
        dolRemoteSave.SetToast("<h2 class=\"red\">Please Login First</h2>");
        return;
    }

    const passwordElement = document.getElementById('ryanshy-new-password');
    if (!passwordElement) {
        return;
    }
    const password = (passwordElement as HTMLInputElement).value;

    await dolRemoteSave.remoteStorage.remoteChangePWD(password, remoteStorageInfo, ()=> {
        (passwordElement as HTMLInputElement).value = "";
    });
}
/*
 * Settings Menu
 */
dolRemoteSave.buttons.OnMenuPositionUpdated = function (event: Event) {
    const target = event.target as any;

    if (dolRemoteSave.settings?.menuButton?.setMenuButtonPosition) {
        const position: InsertPosition = target.value;
        console.log("changing menu button position to", position)
        dolRemoteSave.settings.menuButton.setMenuButtonPosition(position);
    }
}