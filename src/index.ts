var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};

dolRemoteSave.loadCSS = function (cssPath: string) {
    const cssNode = document.createElement("link");
    cssNode.rel = "stylesheet";
    cssNode.href = cssPath;
    document.head.appendChild(cssNode);
}

dolRemoteSave.loadJS = function (scriptPath: string) {
    const jsNode = document.createElement("script");
    jsNode.src = scriptPath;
    document.head.appendChild(jsNode);
}

dolRemoteSave.init = function () {
    globalThis.dolRemoteSave = dolRemoteSave;
    if (!dolRemoteSave.loadJS || !dolRemoteSave.loadCSS) {
        console.log("Error loading dolRemoteSave");
        return;
    }
    // Load CSS
    console.log("dolRemoteSave: init CSS");
    dolRemoteSave.loadCSS("/dolRemoteSaveStyle/dol-styles.css");
    dolRemoteSave.loadCSS("/dolRemoteSaveStyle/index.css");
    // Load HTML
    console.log("dolRemoteSave: init HTML");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshyHTML.js");
    // Load JS
    console.log("dolRemoteSave: init JS");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshyRemoteStorage.js");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshyButtons.js");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshyLocalStorage.js");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshySaveTable.js");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshySettings.js");
    dolRemoteSave.loadJS("/dolRemoteSave/ryanshyDolHelper.js");
    dolRemoteSave.loadJS("/dolRemoteSave/dolRemoteSave.js");
}

dolRemoteSave.init();