/*
Module for stopping/starting the daemon
*/

var child_process = require("child_process");
var path = require("path");
var daemonProcess;

// Catchs all messages from daemon stdout
// TODO: Allow hook
function daemonData(data) {
    console.log("Sia> " + data);
}

// Catchs all messages from daemon stderr
// TODO: Allow hook
function daemonError(err) {
    console.error("Sia> " + err);
}

// Called when daemon process ends
// TODO: Allow hook
function daemonClosed(msg) {
    console.error("SIAD CLOSED: " + msg);
}

// Called when daemon process ends
// TODO: Allow hook
function daemonExited(msg) {
    console.error("SIAD EXITED: " + msg);
}

module.exports = {
    start: function(config, callback) {
        if (daemonProcess) {
            console.error("Daemon process already running");
            return;
        }

        // TODO: Allow arguments from config to daemon
        daemonProcess = child_process.spawn(config.siad_cmd, {cwd: path.join(path.dirname(__dirname), "Sia")});
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
