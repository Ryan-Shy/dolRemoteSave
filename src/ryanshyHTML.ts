var dolRemoteSave: DolRemoteSave = globalThis.dolRemoteSave ?? {};
dolRemoteSave.html = dolRemoteSave.html ?? {};

dolRemoteSave.html.ryanshy_save_overlay = `
    <div id="ryanshy-save-overlay" class="ryanshy-save-overlay-disabled">
        <div id="ryanshy-save-overlay-exit-button" class="ryanshy-exit-button" onclick="dolRemoteSave.buttons.OnCloseOverlay()"></div>
        <div id="ryanshy-overlay-tab-login" class="ryanshy-overlay-tab" onclick="dolRemoteSave.buttons.OnLoginTabClicked()"> Login </div>
        <div id="ryanshy-overlay-tab-saves" class="ryanshy-overlay-tab" onclick="dolRemoteSave.buttons.OnSavesTabClicked()" current> Saves </div>
        <div id="ryanshy-overlay-tab-settings" class="ryanshy-overlay-tab" onclick="dolRemoteSave.buttons.OnSettingsTabClicked()"> Settings </div>

        <div class="ryanshy-custom-overlay-placeholder"></div>

        <div class="ryanshy-panels">
            <div id="ryanshy-login-panel" class="ryanshy-panel-disabled">
                <div class="ryanshy-custom-overlay" style="visibility: hidden; position: absolute; overflow: hidden;">
                    in this tab, the user will enter their username and password, content should be saved on device!
                </div>
                <div class="ryanshy-custom-overlay">
                    <div class="ryanshy-login-element">
                        <h2>Login</h2>
                        <form id="ryanshy-login-form">
                            <p class="ryanshy-input-name">Server:</p>
                            <input id="ryanshy-server" type="text" name="Server" placeholder="https://ryanshy.eu:8089" value="https://ryanshy.eu:8089" required>
                            <br>
                            <p class="ryanshy-input-name">Username:</p>
                            <input id="ryanshy-username" type="text" name="Username" placeholder="username" required>
                            <br>
                            <p class="ryanshy-input-name">Password:</p>
                            <input id="ryanshy-password" type="password" name="Password" placeholder="password" required>
                            <br>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
            <div id="ryanshy-saves-panel" class="ryanshy-panel-enabled">
                <div class="ryanshy-custom-overlay" style="visibility: hidden; position: absolute; overflow: hidden;">
                    this tab will list all remote saves and offer load, overwrite, delete and new save functionality
                </div>
                <div id="ryanshy-saves-element-head" class="ryanshy-custom-overlay">
                    <h2>Saves</h2>
                </div>
                <div class="ryanshy-custom-overlay">
                    <div id="ryanshy-saves-element" class="ryanshy-saves-element">
                        <table class="ryanshy-saves-table">
                            <thead>
                                <tr class="ryanshy-saves-table-head">
                                    <th class="ryanshy-number-col">#</th>
                                    <th class="ryanshy-save-load-col">Save/Load</th>
                                    <th class="ryanshy-id-name-col">ID/Name</th>
                                    <th class="ryanshy-date-col">Date</th>
                                    <th class="ryanshy-delete-col">Delete</th>
                                </tr>
                            </thead>
                            <tbody id="ryanshy-saves-table-body">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id="ryanshy-settings-panel" class="ryanshy-panel-disabled">
                <div class="ryanshy-custom-overlay" style="visibility: hidden; position: absolute; overflow: hidden;">
                    this tab needs to have the change password function and in the future will hold autosave settings
                </div>
                <div class="ryanshy-custom-overlay">
                    <div class="ryanshy-settings-element">
                        <h2>Settings</h2>
                        <div class="ryanshy-menu-button-position">
                            <span style="overflow: hidden;">Menu Button:</span>
                            <label> <input id="ryanshy-settings-menu-button-top" type="radio" name="menuButtonPosition" value="beforebegin"> Top </label>
                            <label> <input id="ryanshy-settings-menu-button-bottom" type="radio" name="menuButtonPosition" value="afterend"> Bottom </label>
                        </div>
                    </div>
                </div>
                <div class="ryanshy-custom-overlay">
                    <div class="ryanshy-change-password-element">
                        <h2>Change Password</h2>
                        <form id="ryanshy-change-password-form">
                            <p class="ryanshy-input-name">New Password:</p>
                            <input id="ryanshy-new-password" type="password" name="New Password" placeholder="password" required>
                            <br>
                            <button type="submit">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

dolRemoteSave.html.ryanshy_greyout = `
    <div id="ryanshy-greyout" class="ryanshy-greyout-disabled"></div>
`;

dolRemoteSave.html.ryanshy_toast = `
    <div id="ryanshy-toast"></div>
`;

dolRemoteSave.html.init = function () {
    console.log("dolRemoteSave: Loading HTML");
    document.body.innerHTML += dolRemoteSave.html?.ryanshy_save_overlay ?? "";
    document.body.innerHTML += dolRemoteSave.html?.ryanshy_greyout ?? "";
    document.body.innerHTML += dolRemoteSave.html?.ryanshy_toast ?? "";
    console.log("dolRemoteSave: Loaded HTML");
}

dolRemoteSave.html.init();