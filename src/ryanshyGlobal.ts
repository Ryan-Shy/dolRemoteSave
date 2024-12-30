export {}

declare global {
    var cw : (
            Window
            & {V?: {tags: string[]}}
            & {SugarCube?: {Save:{serialize:()=>string, deserialize:(data:string)=>any}}}
            )
        | undefined;
    var cOverlay : HTMLElement | undefined;
    var saveObserver : MutationObserver | undefined;
}