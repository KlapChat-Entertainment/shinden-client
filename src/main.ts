import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import Shinden from './api/scrappers/Shinden';

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

  ipcMain.on("min", async _e => {
    mainWindow.minimize();
  });
  
  ipcMain.on("close", async _e => {
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