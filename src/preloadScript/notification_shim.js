'use strict';

// Electron doesn't automatically show notifications in Windows yet, and it's not easy to polyfill.
// So we have to hijack the Notification API.
let {ipcRenderer, Notification} = require('electron');


module.exports = () => {
    const OldNotification = Notification;

    Notification = function (title, options) {
        // Send this to main thread.
        // Catch it in your main 'app' instance with `ipc.on`.
        // Then send it back to the view, if you want, with `event.returnValue` or `event.sender.send()`.
        const notify =  new OldNotification(title, options);
        ipcRenderer.send('notification-shim', {
            title,
            options,
            node: notify
        });

        // Send the native Notification.
        // You can't catch it, that's why we're doing all of this. :)
        return notify;
    };

    Notification.prototype = OldNotification.prototype;
    Notification.permission = OldNotification.permission;
    Notification.requestPermission = OldNotification.requestPermission;
};