const { app, BrowserWindow, Menu, ipcMain, shell, Tray, dialog } = require('electron')

try {
    require('electron-reloader')(module, {});
} catch (_) { }
const path = require('path')
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 690,
        autoHideMenuBar: true,
        title: '彼方云盘',
        frame: false,
        show: false,
        resizable: false,
        webPreferences: {

            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            webviewTag: true,

        }
    })

    win.loadFile('./src/index/start.html')
    //win.webContents.openDevTools({ mode: 'bottom' })
    win.show()
    ipcMain.on("start_msg", (event, cz) => {
        if (cz == 0) {
            win.minimize()
        } else if (cz == 1) {
            app.quit()
        }
    });
}

ipcMain.on('new_window', (event, data) => {
    console.log(data);
    const new_win = new BrowserWindow({
        width: data.Width,
        height: data.Height,
        autoHideMenuBar: true,
        title: data.Title,
        frame: data.Frame,
        resizable: data.Resizable,
        webPreferences: {
            preload: path.join(__dirname, './src/preload.js')
        }
    })

    new_win.loadURL(data.Loadurl)
    //new_win.webContents.openDevTools()
})

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})