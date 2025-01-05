var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
dolRemoteSave.saveTable = dolRemoteSave.saveTable ?? {};

dolRemoteSave.saveTable.clearTable = function () {
    const tableBody = document.getElementById("ryanshy-saves-table-body");
    if (!tableBody) {
        return;
    }
    tableBody.innerHTML = "";
}

dolRemoteSave.saveTable.addRow = function () : TableRow | null {
    const tableBody = document.getElementById("ryanshy-saves-table-body");
    if (!tableBody) {
        return null;
    }

    const tableRow = document.createElement("tr")
    tableRow.className = "ryanshy-saves-table-row";
    tableBody.appendChild(tableRow);

    const number = document.createElement("td");
    number.className = "ryanshy-number-col";
    tableRow.appendChild(number);

    const saveLoad = document.createElement("td");
    saveLoad.className = "ryanshy-save-load-col";
    tableRow.appendChild(saveLoad);
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.className = "saveMenuButton";
    saveLoad.appendChild(saveButton);
    const loadButton = document.createElement("button");
    loadButton.innerText = "Load";
    loadButton.className = "saveMenuButton";
    saveLoad.appendChild(loadButton);

    const idName = document.createElement("td");
    idName.className = "ryanshy-id-name-col";
    tableRow.appendChild(idName);

    const date = document.createElement("td");
    date.className = "ryanshy-date-col";
    tableRow.appendChild(date);

    const del = document.createElement("td");
    del.className = "ryanshy-delete-col";
    tableRow.appendChild(del);
    const delButton = document.createElement("button");
    delButton.innerText = "Delete";
    delButton.className = "saveMenuButton";
    del.appendChild(delButton);

    const ret = {
        number,
        saveLoad,
        saveButton,
        loadButton,
        idName,
        date,
        del,
        delButton,
    }
    return ret;
}

dolRemoteSave.saveTable.addFilledRow = function (number: string, idName: string, date: string) : TableRow | null {
    if (!dolRemoteSave.saveTable?.addRow
        || !dolRemoteSave.saveTable.addSaveButtonCallback
        || !dolRemoteSave.saveTable.addLoadButtonCallback
        || !dolRemoteSave.saveTable.addDeleteButtonCallback) {
        return null;
    }

    const row = dolRemoteSave.saveTable.addRow();
    if (!row) {
        return null;
    }

    row.number.innerText = number;
    row.idName.innerText = idName;
    row.date.innerText = date;
    dolRemoteSave.saveTable.addSaveButtonCallback(row.saveButton, idName);
    dolRemoteSave.saveTable.addLoadButtonCallback(row.loadButton, idName);
    dolRemoteSave.saveTable.addDeleteButtonCallback(row.delButton, idName);

    return row;
}

dolRemoteSave.saveTable.addSaveButtonCallback = function (button: HTMLButtonElement, savename:string) {
    if (!dolRemoteSave.remoteStorage?.createRemoteName || !dolRemoteSave.SetToast) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }

    if (!dolRemoteSave.dolHelper?.canSave || !dolRemoteSave.dolHelper.canSave()) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }
    const remoteName = dolRemoteSave.remoteStorage.createRemoteName(savename);
    if (remoteName.trim().length <= 0) {
        console.error("error during savename encoding");
        dolRemoteSave.SetToast("<h2 class=\"red\">Couldn't create save</h2>");
        return;
    }
    // add normal cb extract info like base game
    button.onclick = () => {
        if (!dolRemoteSave.SetToast
            || !dolRemoteSave.localStorage?.getSettings
            || !dolRemoteSave.dolHelper?.getSaveData
            || !dolRemoteSave.remoteStorage?.remoteSave) {
            return;
        }
        // need to be logged in to use, check local storage
        const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            dolRemoteSave.SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        const data = dolRemoteSave.dolHelper.getSaveData();
        dolRemoteSave.remoteStorage.remoteSave(data, remoteName, remoteStorageInfo, () => {if (dolRemoteSave.saveTable?.loadTable) dolRemoteSave.saveTable.loadTable();});
    };
}

dolRemoteSave.saveTable.addLoadButtonCallback = function (button: HTMLButtonElement, savename:string) {
    if (!dolRemoteSave.remoteStorage?.createRemoteName || !dolRemoteSave.SetToast) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }
    const remoteName = dolRemoteSave.remoteStorage.createRemoteName(savename);
    if (remoteName.trim().length <= 0) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        console.error("error during savename encoding");
        dolRemoteSave.SetToast("<h2 class=\"red\">Couldn't create save</h2>");
        return;
    }
    // add cb for requesting data from remote
    button.onclick = () => {
        if (!dolRemoteSave.SetToast 
            || !dolRemoteSave.localStorage?.getSettings
            || !dolRemoteSave.remoteStorage?.remoteLoad) {
            return;
        }
        // need to be logged in to use, check local storage
        const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            dolRemoteSave.SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        dolRemoteSave.remoteStorage.remoteLoad(remoteName, remoteStorageInfo, (data: string) => {
            if (!dolRemoteSave.dolHelper?.loadSaveData) {
                console.error("Error during Load!");
                return;
            }
            // on success cb use normal load functionality from game
            dolRemoteSave.dolHelper.loadSaveData(data);
        });
    };
}

dolRemoteSave.saveTable.addDeleteButtonCallback = function (button: HTMLButtonElement, savename:string) {
    if (!dolRemoteSave.remoteStorage?.createRemoteName || !dolRemoteSave.SetToast) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }
    const remoteName = dolRemoteSave.remoteStorage.createRemoteName(savename);
    if (remoteName.trim().length <= 0) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        console.error("error during savename encoding");
        dolRemoteSave.SetToast("<h2 class=\"red\">Couldn't create save</h2>");
        return;
    }
    // TODO add cb for deleting remote save
    button.onclick = () => {
        if (!dolRemoteSave.SetToast
            || !dolRemoteSave.localStorage?.getSettings
            || !dolRemoteSave.remoteStorage?.remoteDelete) {
            return;
        }
        // need to be logged in to use, check local storage
        const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            dolRemoteSave.SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        dolRemoteSave.remoteStorage.remoteDelete(remoteName, remoteStorageInfo, () => {
            if (dolRemoteSave.saveTable?.loadTable) dolRemoteSave.saveTable.loadTable();
        });
    }
}

dolRemoteSave.saveTable.addNewSaveButtonCallback = function (button: HTMLButtonElement) {
    if (!dolRemoteSave.dolHelper?.canSave || !dolRemoteSave.dolHelper.canSave()) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }

    button.onclick = () => {
        if (!dolRemoteSave.SetToast
            || !dolRemoteSave.localStorage?.getSettings
            || !dolRemoteSave.dolHelper?.getSaveData
            || !dolRemoteSave.remoteStorage?.createRemoteName
            || !dolRemoteSave.remoteStorage?.remoteSave) {
            return;
        }
        // need to be logged in to use, check local storage
        const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            dolRemoteSave.SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        const saveNameInput = document.getElementById("ryanshy-new-save-name") as HTMLInputElement;
        if (!saveNameInput) {
            dolRemoteSave.SetToast("<h2 class=\"red\">Couldn't create save</h2>");
            return;
        }
        const saveName = saveNameInput.value;
        if (saveName.trim().length <= 0) {
            dolRemoteSave.SetToast("<h2 class=\"red\">Please enter a save name</h2>");
            return;
        }
        const remoteName = dolRemoteSave.remoteStorage.createRemoteName(saveName);
        if (remoteName.trim().length <= 0) {
            console.error("error during savename encoding");
            dolRemoteSave.SetToast("<h2 class=\"red\">Couldn't create save</h2>");
            return;
        }
        const data = dolRemoteSave.dolHelper.getSaveData();
        dolRemoteSave.remoteStorage.remoteSave(data, remoteName, remoteStorageInfo, () => {if (dolRemoteSave.saveTable?.loadTable) dolRemoteSave.saveTable.loadTable();});
    };
}

dolRemoteSave.saveTable.loadTable = function () {
    if (!dolRemoteSave.saveTable?.clearTable
        || !dolRemoteSave.saveTable.addRow
        || !dolRemoteSave.saveTable.addNewSaveButtonCallback) {
        return;
    }
    dolRemoteSave.saveTable.clearTable();

    if (!dolRemoteSave.localStorage?.getSettings || !dolRemoteSave.SetToast || !dolRemoteSave.remoteStorage?.remoteList) {
        return;
    }

    // need to be logged in to use, check local storage
    const remoteStorageInfo = dolRemoteSave.localStorage.getSettings("remoteStorageInfo") as RemoteStorageInfo;
    if (!remoteStorageInfo) {
        console.error("Not logged in yet, cannot change password");
        dolRemoteSave.SetToast("<h2 class=\"red\">Please Login First</h2>");
        return;
    }

    // create new save row
    const row = dolRemoteSave.saveTable.addRow();
    if (!row) {
        console.error("Error creating New Save Row!")
        return;
    }
    const newSaveNameInput = document.createElement("input");
    newSaveNameInput.id = "ryanshy-new-save-name";
    newSaveNameInput.type = "text";
    newSaveNameInput.name = "";
    newSaveNameInput.placeholder = "Save Name";
    row.idName.appendChild(newSaveNameInput);
    dolRemoteSave.saveTable.addNewSaveButtonCallback(row.saveButton);

    row.number.innerText = "NEW";
    row.loadButton.remove();
    row.delButton.remove();

    dolRemoteSave.remoteStorage.remoteList(remoteStorageInfo, (list) => {if (dolRemoteSave.saveTable?.onListLoad) dolRemoteSave.saveTable.onListLoad(list);});
}

dolRemoteSave.saveTable.onListLoad = function (list: SaveList) {
    if (!dolRemoteSave.SetToast || !dolRemoteSave.remoteStorage?.createClearName) {
        return;
    }

    if (!list.saves) {
        dolRemoteSave.SetToast("<h2 class=\"red\">Couldn't load saves</h2>")
        return;
    }

    const saves = list.saves;

    // create a row for each save
    for (let i=0;i<saves.length;i++) {
        const save = saves[i];
        const savename = dolRemoteSave.remoteStorage.createClearName(save.savename);
        if (savename.trim().length <= 0) {
            console.error("Error during row creation of save!")
        } else {
            if (dolRemoteSave.saveTable?.addFilledRow) {
                dolRemoteSave.saveTable.addFilledRow(i.toString(), savename, save.updated_at);
            }
        }
    }
}
