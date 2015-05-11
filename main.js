var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require("fs");
var ipc = require("ipc");
var daemon = require("./lib/daemon.js");
var dialog = require('dialog');
var shell = require('shell');
var path = require('path');

var mainWindow = null;
var popupWindow = null;

// Quit when all windows are closed.
// TODO: Allow daemon to run in background
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        daemon.stop();
        app.quit();
    }
});

app.on('ready', function() {

    var config = loadConfig();

    setupIPCHandlers();

    daemon.start(config, function(err) {
        if (!err) {
            startMainWindow();
        } else {
            showErrorWindow(err);
        }
    });
});

function startMainWindow() {
    mainWindow = new BrowserWindow({
        "width": 1200,
        "height": 800,
        "min-width": 800,
        "min-height": 600,
        "title": "Sia"
    });

    mainWindow.loadUrl('file://' + __dirname + '/site/index.html');

    //mainWindow.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

function showErrorWindow(err) {
    mainWindow = dialog.showMessageBox({
      type: 'warning',
      message: err,
      buttons: ['Okay','Download latest Sia Build', 'Browse for Siad'],
      title: 'Siad error'
    });
    if (mainWindow === 1) {
        shell.openExternal('https://sia-builder.cyrozap.com/job/sia/lastSuccessfulBuild/');
        mainWindow = null;
    } else if (mainWindow == 2) {
        var daemonPath = dialog.showOpenDialog({
              title: 'Select sia daemon',
              defaultPath: __dirname,
              properties: [ 'openFile' ]
        });
        mainWindow = null;
        return daemonPath[0];
    }
}

function loadConfig() {
    // TODO: More error handling
    var configPath = path.join(__dirname, "config.json");
    if (!fs.existsSync(configPath)) {
        var defaultConfigJSON = {
            "autogenerated": true,
            "siad_cmd": "siad",
            "siad_addr": "http://localhost:9980"
        };
        fs.writeFileSync(configPath, JSON.stringify(defaultConfigJSON));
    }
    var config = JSON.parse(fs.readFileSync(configPath));

    // TODO: Prettify Error Window
    // TODO: This should be moved to daemon and listen for an error starting
    // the process, not check for the file
    // var daemonPath = config.siad_cmd;
    // if (!fs.existsSync(daemonPath)) {
    //     daemonPath = showErrorWindow("Siad not found!");
    //     delete config.siad_cmd;
    //     config.siad_cmd = daemonPath;
    //     config.autogenerated = "false";
    //     fs.writeFileSync(configPath, JSON.stringify(config));
    // }

    return config;
}

function setupIPCHandlers() {
    ipc.on("save-file-dialog", function(event){
        var downloadPath = dialog.showSaveDialog();
        event.returnValue = downloadPath ? downloadPath : null;
    });
    ipc.on("share-file", function(event, asciiText){
        popupWindow = new BrowserWindow({
            "width": 640,
            "height": 480,
            "min-width": 640,
            "min-height": 480,
            "title": "Ascii Code"
        });

        popupWindow.loadUrl('file://' + __dirname + '/lib/popups/asciicode.html');

        popupWindow.on('closed', function() {
            popupWindow = null;
        });

        popupWindow.webContents.on('did-finish-load', function() {
            popupWindow.webContents.send('ascii', asciiText);
        });
    });
    ipc.on("close-popup", function(event){
        console.log("clse-popup");
        popupWindow.close();
        // popupWindow = null;
    })
}
