/*
 * type definitions
 */
type RemoteStorageInfo = {
    username?: string,
    credentials?: string,
    server?: string,
}

type SaveList = {
    status: number,
    message: string,
    saves: SaveEntry[],
}

type SaveEntry = {
    savename: string,
    updated_at: string,
}

type TableRow = {
    number : HTMLTableCellElement,
    saveLoad : HTMLTableCellElement,
    saveButton : HTMLButtonElement,
    loadButton : HTMLButtonElement,
    idName : HTMLTableCellElement,
    date : HTMLTableCellElement,
    del : HTMLTableCellElement,
    delButton : HTMLButtonElement,
}