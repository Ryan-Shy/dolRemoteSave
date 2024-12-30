/*
 * Remote Storage
 */
async function remoteLogin(remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
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
            saveSettings("remoteStorageInfo", remoteStorageInfoSave);
            SetToast("<h2 class=\"green\">Login successful</h2>");
            success();
        } else {
            console.error("Login failed");
            SetToast("<h2 class=\"red\">Login failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during login:", error);
        SetToast("<h2 class=\"red\">Error during login</h2>");
        failure();
    }
}

async function remoteSave(data:any, savename: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
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
            SetToast("<h2 class=\"green\">Saving successful</h2>");
            success();
        } else {
            console.error("Saving failed");
            SetToast("<h2 class=\"red\">Saving failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during saving:", error);
        SetToast("<h2 class=\"red\">Error during saving</h2>");
        failure();
    }
}

async function remoteLoad(savename: string, remoteStorageInfo: RemoteStorageInfo, success:(data:any)=>any = ()=>{}, failure:()=>any = ()=>{}) {
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
            SetToast("<h2 class=\"green\">Loading successful</h2>");
            success(data);
            return data;
        } else {
            console.error("Loading failed");
            SetToast("<h2 class=\"red\">Loading failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during loading:", error);
        SetToast("<h2 class=\"red\">Error during loading</h2>");
        failure();
    }
    return null;
}

async function remoteDelete(savename: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
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
            SetToast("<h2 class=\"green\">Delete successful</h2>");
            success();
        } else {
            console.error("Delete failed");
            SetToast("<h2 class=\"red\">Delete failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during delete:", error);
        SetToast("<h2 class=\"red\">Error during delete</h2>");
        failure();
    }
}

async function remoteList(remoteStorageInfo: RemoteStorageInfo, success:(data:SaveList)=>any = ()=>{}, failure:()=>any = ()=>{}) {
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
            SetToast("<h2 class=\"red\">Listing saves failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during listing saves:", error);
        SetToast("<h2 class=\"red\">Error during listing saves</h2>");
        failure();
    }
    return null;
}

async function remoteChangePWD(password: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) {
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
            saveSettings("remoteStorageInfo", remoteStorageInfo);
            SetToast("<h2 class=\"green\">Password changed successful</h2>");
            success();
        } else {
            console.error("Password change failed");
            SetToast("<h2 class=\"red\">Password change failed</h2>");
            failure();
        }
    } catch (error) {
        console.error("Error during change password:", error);
        SetToast("<h2 class=\"red\">Error during change password</h2>");
        failure();
    }
}

function createRemoteName(clearName: string) : string {
    try {
        const remoteName = btoa(clearName);
        return remoteName;
    } catch (error) {
        console.error("error during savename encoding:",error);
    }
    return "";
}

function createClearName(remoteName: string) : string {
    try {
        const clearName = atob(remoteName);
        return clearName;
    } catch (error) {
        console.error("error during savename decoding:",error);
    }
    return "";
}