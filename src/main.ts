import { app, autoUpdater, BrowserWindow, FeedURLOptions, ipcMain, shell } from 'electron';
import path from 'path';
import Shinden from './api/scrappers/Shinden';
import fetch from 'electron-fetch';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import isDev from 'electron-is-dev';
const isWin = process.platform === "win32";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const server = 'https://update.electronjs.org';
const feed: any = `${server}/Tsugumik/shinden-client/${process.platform}-${process.arch}/${app.getVersion()}`;
let updating = false;
let updateDownloaded = false;
let checking = false;

autoUpdater.setFeedURL(feed);

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
      contextIsolation: true
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/src/views/home.html');
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.setWindowOpenHandler(()=>{
    return {action: 'deny'};
  });

  ElectronBlocker.fromLists(fetch, [
    "https://raw.githubusercontent.com/MajkiIT/polish-ads-filter/master/polish-adblock-filters/adblock.txt",
    "https://easylist.to/easylist/easylist.txt"
  ]).then((blocker) => {
    blocker.enableBlockingInSession(mainWindow.webContents.session);
  });

  ipcMain.on("min", async _e => {
    mainWindow.minimize();
  });
  
  ipcMain.on("close", async _e => {
    app.quit();
  });

  ipcMain.on("checkUpdates", async()=>{
    if(isDev) {
      mainWindow.webContents.send("updateStatusChange", "Aplikacja pracuje w trybie developerskim.");
      mainWindow.webContents.send("finishLoading", true);
    } else if(!isWin) {
      mainWindow.webContents.send("updateStatusChange", `Twoja platforma: ${process.platform} nie jest obsługiwana.`);
      mainWindow.webContents.send("finishLoading", true);
    } else {
      if(checking) {
        mainWindow.webContents.send("updateStatusChange", "Sprawdzanie dostępności aktualizacji.");
      } else if(updating) {
        mainWindow.webContents.send("updateStatusChange", "Aktualizacja jest dostępna, trwa pobieranie.");
      } else if (updateDownloaded) {
        mainWindow.webContents.send("updateStatusChange", "Aktualizacja została pobrana, zrestartuj aplikacje.");
        mainWindow.webContents.send("finishLoading", true);
      } else {
        autoUpdater.checkForUpdates();
        mainWindow.webContents.send("updateStatusChange", "Sprawdzanie dostępności aktualizacji.");
        checking = true;
      }
    }
  });

  autoUpdater.on("update-not-available", async() => {
    checking = false;
    mainWindow.webContents.send("updateStatusChange", "Brak dostępnych aktualizacji.");
    mainWindow.webContents.send("finishLoading", true);
  });
  
  autoUpdater.on("update-available", async() => {
    checking = false;
    updating = true;
    mainWindow.webContents.send("updateStatusChange", "Aktualizacja jest dostępna, trwa pobieranie.");
  });
  
  autoUpdater.on("update-downloaded", async() => {
    updating = false;
    updateDownloaded = true;
    mainWindow.webContents.send("updateStatusChange", "Aktualizacja została pobrana, zrestartuj aplikacje.");
    mainWindow.webContents.send("finishLoading", false);
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

ipcMain.handle("searchAnime", async(_event, data)=>{
  const DATA = await Shinden.searchAnime(data);
  return DATA;
});

ipcMain.handle("getDescription", async(_event, data)=>{
  const DATA = await Shinden.getDescription(data);
  return DATA;
});

ipcMain.handle("getEpisodes", async(_event, data)=>{
  const DATA = await Shinden.getEpisodes(data);
  return DATA;
});

ipcMain.handle("getPlayers", async(_event, data)=>{
  const DATA = await Shinden.getPlayers(data);
  return DATA;
});

ipcMain.handle("getPlayer", async(_event, data)=>{
  const DATA = await Shinden.getPlayer(data);
  return DATA;
});

// ipcMain.handle("login", async(_event, loginData)=>{
//   await Shinden.login(loginData);
// });

// ipcMain.handle("getCookies", async()=>{
//   const cookies = await Shinden.getCookies();
//   return cookies;
// });

ipcMain.handle("getVersion", async()=>{
  return app.getVersion();
});

// ipcMain.handle("clearCookies", async(_event)=>{
//   await Shinden.clearCookies();
// });

// ipcMain.handle("setCookies", async(_event, cookies)=>{
//   await Shinden.setCookies(cookies);
// });

ipcMain.handle("openReleasePage", async()=>{
  shell.openExternal(`https://github.com/Tsugumik/shinden-client/releases/tag/v${app.getVersion()}`);
});