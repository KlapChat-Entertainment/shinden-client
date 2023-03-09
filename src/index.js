const { app, BrowserWindow, ipcMain } = require('electron');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const ShindenAPI = require('./api/scrappers/Shinden');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    icon: __dirname + '/img/icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'views/home.html'));


  // Prevent stinky ads from opening popup windows
  mainWindow.webContents.setWindowOpenHandler(()=>{
    return {action: 'deny'};
  });

  ElectronBlocker.fromLists(fetch, [
    "https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/adblock.txt",
    "https://easylist.to/easylist/easylist.txt"
  ]).then((blocker) => {
    blocker.enableBlockingInSession(mainWindow.webContents.session);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  ipcMain.on("min", async e => {
    mainWindow.minimize();
  });
  
  ipcMain.on("close", async e => {
    app.quit();
  });

};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("searchAnime", async(event, data)=>{
  const DATA = await ShindenAPI.searchAnime(data);
  return DATA;
});

ipcMain.handle("getDescription", async(event, data)=>{
  const DATA = await ShindenAPI.getDescription(data);
  return DATA;
});

ipcMain.handle("getEpisodes", async(event, data)=>{
  const DATA = await ShindenAPI.getEpisodes(data);
  return DATA;
});

ipcMain.handle("getPlayers", async(event, data)=>{
  const DATA = await ShindenAPI.getPlayers(data);
  return DATA;
});

ipcMain.handle("getPlayer", async(event, data)=>{
  const DATA = await ShindenAPI.getPlayer(data);
  return DATA;
});