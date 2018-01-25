const { ipcRenderer } = require('electron');
(function (window) {
    window.onload = function () {
        const loginPage = document.getElementsByClassName('login')[0];
        loginPage.style.minHeight = "auto";
        const loginPanel = document.getElementsByClassName("login_box")[0];
        loginPanel.style.height = "auto";
        loginPanel.style.top = "60%";

        const lang = document.getElementsByClassName("lang")[0];
        lang.style.display = "none";
        const copyRight = document.getElementsByClassName("copyright")[0];
        copyRight.style.display = "none";
        const main = document.getElementsByClassName('main')[0];
        main.style.minHeight = "auto";
    };
    window.sendToHost = function(options){
        ipcRenderer.sendToHost('wechat_message', options)
    }
})(window);
