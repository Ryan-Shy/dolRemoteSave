var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};

dolRemoteSave.settings = dolRemoteSave.settings ?? {};
dolRemoteSave.settings.menuButton = dolRemoteSave.settings.menuButton ?? {};

dolRemoteSave.settings.menuButton.getMenuButtonPosition = function () : InsertPosition {
    if (dolRemoteSave.localStorage?.getSettings) {
        const menuButton = dolRemoteSave.localStorage.getSettings("dolRemoteStorage_menuButton") ?? {position: "afterend"};
        return menuButton.position;
    }
    return "afterend";
}
dolRemoteSave.settings.menuButton.setMenuButtonPosition = function (pos: InsertPosition) {
    if (dolRemoteSave.localStorage?.getSettings) {
        const menuButton = dolRemoteSave.localStorage.getSettings("dolRemoteStorage_menuButton") ?? {};
        menuButton.position = pos;
        if (dolRemoteSave.localStorage.saveSettings) {
            dolRemoteSave.localStorage.saveSettings("dolRemoteStorage_menuButton", menuButton);
        }
    }
}