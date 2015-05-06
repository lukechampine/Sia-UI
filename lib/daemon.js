/*
Module for stopping/starting the daemon
*/

var child_process = require("child_process");
var path = require("path");
var daemonProcess;

// Catchs all messages from daemon stdout
// TODO: Allow hook
function daemonData(data) {
    console.log("Daemon.js> " + data);
}

// Catchs all messages from daemon stderr
// TODO: Allow hook
function daemonError(err) {
    console.error("Daemon.js> " + err);
}

// Called when daemon process ends
// TODO: Allow hook
function daemonClosed(msg) {
    console.error("Daemon.js> SIAD CLOSED: " + msg);
}

// Called when daemon process ends
// TODO: Allow hook
function daemonExited(msg) {
    console.error("Daemon.js> SIAD EXITED: " + msg);
}

module.exports = {
    start: function(config, callback) {
        if (daemonProcess) {
            console.error("Daemon process already running");
            return;
        }

        // TODO: Allow arguments from config to daemon
        daemonProcess = child_process.spawn("ls", {cwd: path.join(path.dirname(__dirname), "Sia")});
        daemonProcess.stdout.on("data", daemonData);
        daemonProcess.on("error", daemonError);
        daemonProcess.on("close", daemonClosed);
        daemonProcess.on("exit", daemonExited);
        callback();
    },
    stop: function() {
        if (!daemonProcess) {
            console.error("Daemon process not running!");
            return;
        }
        daemonProcess.kill("SIGINT");
        daemonProcess = null;
    }
};
