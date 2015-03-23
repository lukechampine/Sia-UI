/*
Module for stopping/starting the daemon
*/

var child_process = require("child_process");
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
function daemonClosed() {
    console.error("SIAD CLOSED");
}

module.exports = {
    start: function(config, callback) {
        if (daemonProcess) {
            console.error("Daemon process already running");
            return;
        }

        // TODO: Allow arguments from config to daemon
        daemonProcess = child_process.spawn(config.siad_cmd, {cwd: "./Sia"});
        daemonProcess.stdout.on("data", daemonData);
        daemonProcess.on("error", daemonError);
        daemonProcess.on("close", daemonClosed);
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
