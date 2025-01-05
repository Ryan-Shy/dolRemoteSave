/*
 * type definitions
 */
type DolRemoteSave = {
    init?: () => void,
    loadJS?: (scriptPath: string) => void,
    loadCSS?: (cssPath: string) => void,
    html?: {
        init?: () => void,
        ryanshy_save_overlay?: string,
        ryanshy_greyout?: string,
        ryanshy_toast?: string,
    },
    AddSaveDiv?: () => void,
    OnIframeLoad?: () => void,
    SetToast?: (msg:string) => void,
    OnLoad?: () => void,
    OnDocumentChange?: (mutationList : MutationRecord[], observer : MutationObserver) => void,
    OnCustomOverlayChange?: (mutationList : MutationRecord[], observer : MutationObserver) => void,
    AddSaveOverlayListener?: () => void,
    RemoveSaveOverlayListener?: () => void,
    AddDocumentListener?: () => void,
    createCW?: () => boolean,
    main?: () => void,
    dolHelper?: {
        canSave?: () => boolean,
        getSaveData?: () => string,
        loadSaveData?: (data: string) => void,
    },
    localStorage?: {
        saveSettings?: (key: string, value: any) => void,
        getSettings?: (key: string) => any,
        fillFormFromStorage?: () => void,
    }
    remoteStorage?: {
        remoteLogin?: (remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) => Promise<void>,
        remoteSave?: (data:any, savename: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) => Promise<void>,
        remoteLoad?: (savename: string, remoteStorageInfo: RemoteStorageInfo, success:(data:any)=>any = ()=>{}, failure:()=>any = ()=>{}) => Promise<any>,
        remoteDelete?: (savename: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) => Promise<void>,
        remoteList?: (remoteStorageInfo: RemoteStorageInfo, success:(data:SaveList)=>any = ()=>{}, failure:()=>any = ()=>{}) => Promise<SaveList | null | undefined>,
        remoteChangePWD?: (password: string, remoteStorageInfo: RemoteStorageInfo, success:()=>any = ()=>{}, failure:()=>any = ()=>{}) => Promise<void>,
        createRemoteName?: (clearName:string) => string,
        createClearName?: (clearName:string) => string,
    }
    saveTable?: {
        clearTable?: () => void,
        addRow?: () => TableRow | null,
        addFilledRow?: (number: string, idName: string, date: string) => TableRow | null,
        addSaveButtonCallback?: (button: HTMLButtonElement, saveName: string) => void,
        addLoadButtonCallback?: (button: HTMLButtonElement, saveName: string) => void,
        addDeleteButtonCallback?: (button: HTMLButtonElement, saveName: string) => void,
        addNewSaveButtonCallback?: (button: HTMLButtonElement) => void,
        loadTable?: () => void,
        onListLoad?: (list: SaveList) => void,
    }
    buttons?: {
        OnMenuButtonClick?: () => void,
        OnCloseOverlay?: () => void,
        OnLoginTabClicked?: () => void,
        OnSavesTabClicked?: () => void,
        OnSettingsTabClicked?: () => void,
        OnLoginSubmit?: (event: SubmitEvent) => Promise<void>,
        OnChangePasswordSubmit?: (event: SubmitEvent) => Promise<void>,
    }
}

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