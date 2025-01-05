var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
dolRemoteSave.localStorage = dolRemoteSave.localStorage ?? {};

/*
 * Local Storage
 */
dolRemoteSave.localStorage.saveSettings = function (key: string, value: any) {
    if (typeof key !== 'string' || !key.trim()) {
        console.error('Invalid key. It must be a non-empty string.');
        return;
    }

    try {
        const settings = JSON.stringify(value);
        localStorage.setItem(key, settings);
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

dolRemoteSave.localStorage.getSettings = function (key: string) : any {
    if (typeof key !== 'string' || !key.trim()) {
        console.error('Invalid key. It must be a non-empty string.');
        return null;
    }

    try {
        const settings = localStorage.getItem(key);
        return settings ? JSON.parse(settings) : null;
    } catch (error) {
        console.error('Failed to retrieve settings:', error);
        return null;
    }
}

dolRemoteSave.localStorage.fillFormFromStorage = function () {
    if (!dolRemoteSave.localStorage?.getSettings) {
        return;
    }
    const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
    if (!remoteStorageInfo) {
        return;
    }

    const serverElement = document.getElementById('ryanshy-server');
    const usernameElement = document.getElementById('ryanshy-username');

    if (!serverElement || !usernameElement) {
        return;
    }

    if (remoteStorageInfo.username) {
        (usernameElement as HTMLInputElement).value = remoteStorageInfo.username;
    }
    if (remoteStorageInfo.server) {
        (serverElement as HTMLInputElement).value = remoteStorageInfo.server;
    }
}