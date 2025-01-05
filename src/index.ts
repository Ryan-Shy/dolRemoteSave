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
    dolRemoteSave.loadCSS("/ryanshyStyle/dol-styles.css");
    dolRemoteSave.loadCSS("/ryanshyStyle/index.css");
    // Load HTML
    console.log("dolRemoteSave: init HTML");
    dolRemoteSave.loadJS("/ryanshy/ryanshyHTML.js");
    // Load JS
    console.log("dolRemoteSave: init JS");
    dolRemoteSave.loadJS("/ryanshy/ryanshyRemoteStorage.js");
    dolRemoteSave.loadJS("/ryanshy/ryanshyButtons.js");
    dolRemoteSave.loadJS("/ryanshy/ryanshyLocalStorage.js");
    dolRemoteSave.loadJS("/ryanshy/ryanshySaveTable.js");
    dolRemoteSave.loadJS("/ryanshy/ryanshyDolHelper.js");
    dolRemoteSave.loadJS("/ryanshy/dolRemoteSave.js");
}

dolRemoteSave.init();