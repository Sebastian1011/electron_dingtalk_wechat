const { app, BrowserWindow, Tray, nativeImage, shell, ipcMain, Notification  } = require('electron');
const path = require('path');
const url = require('url');
const dingPage = require('./src/dingPage');
const shim = require('./build/notification_shim');


// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win;
// let icon = nativeImage.createFromPath('/Users/somebody/images/icon.png')
const index_win = {
    width: 990,
    height: 656,
    icon: path.join(__dirname, 'assets/icons/png/icon.png'),
};

function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow(index_win);

    win.loadURL(url.format({
        protocol: 'file',
        pathname: path.join(__dirname, 'index.html')
    }))
	win.webContents.on('did-finish-load', function() {
		win.show();
	});
	
	
	// 打开开发者工具。
	win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    });
    
    // open link in a new browser window
	win.webContents.on('will-navigate', handleRedirect);
	win.webContents.on('new-window', handleRedirect);
	
	// listen notification
    ipcMain.on('new-message', (event, arg) => {
        console.log('new message: ', arg);
	    event.sender.send('new-message-reply', arg)
    });
	
	ipcMain.on('update-status', (event, arg) => {
		console.log('update status: ', arg);
		event.sender.send('update-status', arg)
	});
	
	ipcMain.on('open-main-window', (event) => {
		console.log('open main window')
		win.show();
	});


    win.setResizable(false);
}
function handleRedirect (e, url) {
    if (url !== dingPage.WEB_DT){
        e.preventDefault();
        shell.openExternal(url);
    }
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // 在这文件，你可以续写应用剩下主进程代码。
    // 也可以拆分成几个文件，然后用 require 导入。
    if (win === null) {
        createWindow()
    }
});
// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
