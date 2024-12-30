function clearTable() {
    const tableBody = document.getElementById("ryanshy-saves-table-body");
    if (!tableBody) {
        return;
    }
    tableBody.innerHTML = "";
}

function addRow() : TableRow | null {
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

function addFilledRow(number: string, idName: string, date: string) : TableRow | null {
    const row = addRow();
    if (!row) {
        return null;
    }

    row.number.innerText = number;
    row.idName.innerText = idName;
    row.date.innerText = date;
    addSaveButtonCallback(row.saveButton, idName);
    addLoadButtonCallback(row.loadButton, idName);
    addDeleteButtonCallback(row.delButton, idName);

    return row;
}

function addSaveButtonCallback(button: HTMLButtonElement, savename:string) {
    if (!canSave()) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }
    const remoteName = createRemoteName(savename);
    if (remoteName.trim().length <= 0) {
        console.error("error during savename encoding");
        SetToast("<h2 class=\"red\">Couldn't create save</h2>");
        return;
    }
    // add normal cb extract info like base game
    button.onclick = () => {
        // need to be logged in to use, check local storage
        const remoteStorageInfo = getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        const data = getSaveData();
        remoteSave(data, remoteName, remoteStorageInfo, () => {loadTable();});
    };
}

function addLoadButtonCallback(button: HTMLButtonElement, savename:string) {
    const remoteName = createRemoteName(savename);
    if (remoteName.trim().length <= 0) {
        console.error("error during savename encoding");
        SetToast("<h2 class=\"red\">Couldn't create save</h2>");
        return;
    }
    // add cb for requesting data from remote
    button.onclick = () => {
        // need to be logged in to use, check local storage
        const remoteStorageInfo = getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        remoteLoad(remoteName, remoteStorageInfo, (data: string) => {
            // on success cb use normal load functionality from game
            loadSaveData(data);
        });
    };
}

function addDeleteButtonCallback(button: HTMLButtonElement, savename:string) {
    const remoteName = createRemoteName(savename);
    if (remoteName.trim().length <= 0) {
        console.error("error during savename encoding");
        SetToast("<h2 class=\"red\">Couldn't create save</h2>");
        return;
    }
    // TODO add cb for deleting remote save
    button.onclick = () => {
        // need to be logged in to use, check local storage
        const remoteStorageInfo = getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        remoteDelete(remoteName, remoteStorageInfo, () => {
            loadTable();
        });
    }
}

function addNewSaveButtonCallback(button: HTMLButtonElement) {
    if (!canSave()) {
        button.setAttribute("disabled","");
        button.onclick = () => {};
        return;
    }

    button.onclick = () => {
        // need to be logged in to use, check local storage
        const remoteStorageInfo = getSettings("remoteStorageInfo") as RemoteStorageInfo;
        if (!remoteStorageInfo) {
            console.error("Not logged in yet, cannot change password");
            SetToast("<h2 class=\"red\">Please Login First</h2>");
            return;
        }
        const saveNameInput = document.getElementById("ryanshy-new-save-name") as HTMLInputElement;
        if (!saveNameInput) {
            SetToast("<h2 class=\"red\">Couldn't create save</h2>");
            return;
        }
        const saveName = saveNameInput.value;
        if (saveName.trim().length <= 0) {
            SetToast("<h2 class=\"red\">Please enter a save name</h2>");
            return;
        }
        const remoteName = createRemoteName(saveName);
        if (remoteName.trim().length <= 0) {
            console.error("error during savename encoding");
            SetToast("<h2 class=\"red\">Couldn't create save</h2>");
            return;
        }
        const data = getSaveData();
        remoteSave(data, remoteName, remoteStorageInfo, () => {loadTable();});
    };
}

function loadTable() {
    clearTable();

    // need to be logged in to use, check local storage
    const remoteStorageInfo = getSettings("remoteStorageInfo") as RemoteStorageInfo;
    if (!remoteStorageInfo) {
        console.error("Not logged in yet, cannot change password");
        SetToast("<h2 class=\"red\">Please Login First</h2>");
        return;
    }

    // create new save row
    const row = addRow();
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
    addNewSaveButtonCallback(row.saveButton);

    row.number.innerText = "NEW";
    row.loadButton.remove();
    row.delButton.remove();

    remoteList(remoteStorageInfo, (list) => {onListLoad(list);});
}

function onListLoad(list: SaveList) {
    if (!list.saves) {
        SetToast("<h2 class=\"red\">Couldn't load saves</h2>")
        return;
    }

    const saves = list.saves;

    // create a row for each save
    for (let i=0;i<saves.length;i++) {
        const save = saves[i];
        const savename = createClearName(save.savename);
        if (savename.trim().length <= 0) {
            console.error("Error during row creation of save!")
        } else {
            addFilledRow(i.toString(), savename, save.updated_at);
        }
    }
}
