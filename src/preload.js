const { contextBridge, ipcRenderer } = require("electron");

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

contextBridge.exposeInMainWorld('electronAPI', {
    min: async () => ipcRenderer.send("min"),
    close: async () => ipcRenderer.send("close"),
});

contextBridge.exposeInMainWorld('shindenAPI', {
    searchAnime: async name => await ipcRenderer.invoke("searchAnime", name),
    getDescription: async linkToSeries => await ipcRenderer.invoke("getDescription", linkToSeries),
    getEpisodes: async linkToSeries => await ipcRenderer.invoke("getEpisodes", linkToSeries),
    getPlayers: async episodeLink => await ipcRenderer.invoke("getPlayers", episodeLink),
    getPlayer: async onlineId => await ipcRenderer.invoke("getPlayer", onlineId),
});