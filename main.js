const { app, BrowserWindow, desktopCapturer } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'Ethnic-Thesia',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // INTERCEPT AUDIO REQUESTS
    // This allows the application to silently bypass the browser screen-share popup
    // and instantly fetch the Windows Master Volume (loopback) without asking the user!
    mainWindow.webContents.session.setDisplayMediaRequestHandler((request, callback) => {
        desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
            // Provide the first screen and explicitly grant loopback (Master Volume) access
            callback({ video: sources[0], audio: 'loopback' });
        }).catch(err => {
            console.error('Error getting sources:', err);
        });
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
