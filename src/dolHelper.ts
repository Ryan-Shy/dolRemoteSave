function canSave() : boolean {
    if (!createCW()) {
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

function getSaveData() : string {
    if (!createCW()) {
        return "";
    }
    if (!globalThis.cw) {
        return "";
    }
    const cw = globalThis.cw;
    return cw.SugarCube?.Save.serialize() ?? "";
}

function loadSaveData(data: string) {
    if (!createCW()) {
        return "";
    }
    if (!globalThis.cw) {
        return "";
    }
    const cw = globalThis.cw;
    cw.SugarCube?.Save.deserialize(data);
}