var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
dolRemoteSave.dolHelper = dolRemoteSave.dolHelper ?? {};

dolRemoteSave.dolHelper.canSave = function () : boolean {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
        return false;
    }
    if (!globalThis.cw) {
        return false;
    }
    const cw = globalThis.cw;
    // hint: use cw.V.tags for checking if saving is allowed here
    // cw.V.tags.includes
    const tags = cw.V?.tags ?? [];
    const canSave = !tags.includes("nosave");
    return canSave;
}

dolRemoteSave.dolHelper.getSaveData = function () : string {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
        return "";
    }
    if (!globalThis.cw) {
        return "";
    }
    const cw = globalThis.cw;
    return cw.SugarCube?.Save.serialize() ?? "";
}

dolRemoteSave.dolHelper.loadSaveData = function (data: string) {
    if ((!dolRemoteSave.createCW || !dolRemoteSave.createCW())) {
        return "";
    }
    if (!globalThis.cw) {
        return "";
    }
    const cw = globalThis.cw;
    cw.SugarCube?.Save.deserialize(data);
}