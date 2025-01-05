var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
dolRemoteSave.remoteStorage = dolRemoteSave.remoteStorage ?? {};
/*
 * Remote Storage
 */
dolRemoteSave.remoteStorage.remoteLogin = async function (remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
    if (!dolRemoteSave.SetToast || !dolRemoteSave.localStorage?.saveSettings) {
        return;
    }
    try {
        const response = await fetch(`${remoteStorageInfo.server}/dol/user/login`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Basic ${remoteStorageInfo.credentials}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const remoteStorageInfoSave: RemoteStorageInfo = {username:remoteStorageInfo.username, credentials: remoteStorageInfo.credentials, server: remoteStorageInfo.server};
            dolRemoteSave.localStorage.saveSettings("remoteStorageInfo", remoteStorageInfoSave);
            dolRemoteSave.SetToast("<h2 class=\"green\">Login successful</h2>");
            success();
        } else {
            console.error("Login failed");
            dolRemoteSave.SetToast("<h2 class=\"red\">Login failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during login:", error);
        dolRemoteSave.SetToast("<h2 class=\"red\">Error during login</h2>");
        failure();
    }
}

dolRemoteSave.remoteStorage.remoteSave = async function (data:any, savename: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
    if (!dolRemoteSave.SetToast) {
        return;
    }
    const requestBody = data;

    try {
        const response = await fetch(`${remoteStorageInfo.server}/dol/save/${savename}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                'Authorization': `Basic ${remoteStorageInfo.credentials}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            dolRemoteSave.SetToast("<h2 class=\"green\">Saving successful</h2>");
            success();
        } else {
            console.error("Saving failed");
            dolRemoteSave.SetToast("<h2 class=\"red\">Saving failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during saving:", error);
        dolRemoteSave.SetToast("<h2 class=\"red\">Error during saving</h2>");
        failure();
    }
}

dolRemoteSave.remoteStorage.remoteLoad = async function (savename: string, remoteStorageInfo: RemoteStorageInfo, success:(data:any)=>any = ()=>{}, failure:()=>any = ()=>{}) {
    if (!dolRemoteSave.SetToast) {
        return;
    }
    try {
        const response = await fetch(`${remoteStorageInfo.server}/dol/save/${savename}`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Basic ${remoteStorageInfo.credentials}`,
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response.ok) {
            dolRemoteSave.SetToast("<h2 class=\"green\">Loading successful</h2>");
            success(data);
            return data;
        } else {
            console.error("Loading failed");
            dolRemoteSave.SetToast("<h2 class=\"red\">Loading failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during loading:", error);
        dolRemoteSave.SetToast("<h2 class=\"red\">Error during loading</h2>");
        failure();
    }
    return null;
}

dolRemoteSave.remoteStorage.remoteDelete = async function (savename: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
    if (!dolRemoteSave.SetToast) {
        return;
    }
    try {
        const response = await fetch(`${remoteStorageInfo.server}/dol/save/${savename}`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                'Authorization': `Basic ${remoteStorageInfo.credentials}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            dolRemoteSave.SetToast("<h2 class=\"green\">Delete successful</h2>");
            success();
        } else {
            console.error("Delete failed");
            dolRemoteSave.SetToast("<h2 class=\"red\">Delete failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during delete:", error);
        dolRemoteSave.SetToast("<h2 class=\"red\">Error during delete</h2>");
        failure();
    }
}

dolRemoteSave.remoteStorage.remoteList = async function (remoteStorageInfo: RemoteStorageInfo, success:(data:SaveList)=>any = ()=>{}, failure:()=>any = ()=>{}) {
    if (!dolRemoteSave.SetToast) {
        return;
    }
    try {
        const response = await fetch(`${remoteStorageInfo.server}/dol/user/list`, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Basic ${remoteStorageInfo.credentials}`,
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json() as SaveList;

        if (response.ok) {
            success(data);
            return data;
        } else {
            console.error("Listing saves failed");
            dolRemoteSave.SetToast("<h2 class=\"red\">Listing saves failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during listing saves:", error);
        dolRemoteSave.SetToast("<h2 class=\"red\">Error during listing saves</h2>");
        failure();
    }
    return null;
}

dolRemoteSave.remoteStorage.remoteChangePWD = async function (password: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
    if (!dolRemoteSave.SetToast || !dolRemoteSave.localStorage?.saveSettings) {
        return;
    }
    const requestBody = {password: password};

    try {
        const response = await fetch(`${remoteStorageInfo.server}/dol/user/changepwd`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                'Authorization': `Basic ${remoteStorageInfo.credentials}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            remoteStorageInfo.credentials = btoa(`${remoteStorageInfo.username}:${password}`);
            dolRemoteSave.localStorage.saveSettings("remoteStorageInfo", remoteStorageInfo);
            dolRemoteSave.SetToast("<h2 class=\"green\">Password changed successful</h2>");
            success();
        } else {
            console.error("Password change failed");
            dolRemoteSave.SetToast("<h2 class=\"red\">Password change failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during change password:", error);
        dolRemoteSave.SetToast("<h2 class=\"red\">Error during change password</h2>");
        failure();
    }
}

dolRemoteSave.remoteStorage.createRemoteName = function (clearName: string) : string {
    try {
        const remoteName = btoa(clearName);
        return remoteName;
    } catch (error) {
        console.error("error during savename encoding:",error);
    }
    return "";
}

dolRemoteSave.remoteStorage.createClearName = function (remoteName: string) : string {
    try {
        const clearName = atob(remoteName);
        return clearName;
    } catch (error) {
        console.error("error during savename decoding:",error);
    }
    return "";
}