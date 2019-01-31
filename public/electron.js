const electron = require('electron');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
let mainWindow;

const isDev = require('electron-is-dev');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { webSecurity: !isDev }
  });
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  }
  const menu = Menu.buildFromTemplate([
    {
      label: 'Dev',
      submenu: [
        {
          label: 'Dev Tools',
          click() {
            mainWindow.webContents.openDevTools();
          }
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
