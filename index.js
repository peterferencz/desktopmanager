const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const path = require('path')
const openApp = require('child_process').execFile

const createWindow = () => {
    const win = new BrowserWindow({
        kiosk: true,
        transparent: true,
        frame: false,
        movable: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        show: true,
        opacity: 0,
        closable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })
  
    win.loadFile('pages/index.html')
    return win
}

console.log(app.getPath("appData"))

app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    //path: path.resolve(path.dirname(process.execPath), '..', 'Update.exe'),
    args: [
        '--processStart', `"${path.basename(process.execPath)}"`,
    ]
})

app.whenReady().then(() => {
    let open = false
    const win = createWindow()
    
    globalShortcut.register('CommandOrControl+Tab', () => toggleWindow())

    function toggleWindow() {
        if(open){
            fadeOut()
            setTimeout(() => {
                win.hide()
            }, 500)
        }else{
            win.setOpacity(0)
            win.show()
            setTimeout(() => {
                fadeIn()
            }, 200);
        }
        open = !open
    }
    

    function fadeIn (step = 0.1,fadeEveryXSeconds = 10) {
        let opacity = win.getOpacity()
        const interval = setInterval(() => {
          if (opacity >= 1) clearInterval(interval)
          win.setOpacity(opacity)
          opacity += step
        }, fadeEveryXSeconds)
        return interval
    }
    function fadeOut (step = 0.1,fadeEveryXSeconds = 10) {
        let opacity = win.getOpacity()
        const interval = setInterval(() => {
          if (opacity <= 0) clearInterval(interval)
          win.setOpacity(opacity)
          opacity -= step
        }, fadeEveryXSeconds)
        return interval
    }
    
    ipcMain.on('open-app', (event, path) => {
        toggleWindow()
        openApp(path)
    })
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})