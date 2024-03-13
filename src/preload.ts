// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    min: async() => ipcRenderer.send("min"),
    close: async() => ipcRenderer.send("close")
});

contextBridge.exposeInMainWorld('shindenAPI', {
    searchAnime: async (name: string) => await ipcRenderer.invoke("searchAnime", name),
    getDescription: async (linkToSeries: string) => await ipcRenderer.invoke("getDescription", linkToSeries),
    getEpisodes: async (linkToSeries: string) => await ipcRenderer.invoke("getEpisodes", linkToSeries),
    getPlayers: async (episodeLink: string) => await ipcRenderer.invoke("getPlayers", episodeLink),
    getPlayer: async (onlineId: string) => await ipcRenderer.invoke("getPlayer", onlineId),
    login: async (loginData: string) => await ipcRenderer.invoke("login", loginData),
    clearCookies: async ()=> await ipcRenderer.invoke("clearCookies"),
    getCookies: async ()=> await ipcRenderer.invoke("getCookies"),
    setCookies: async (cookies: string) => await ipcRenderer.invoke("setCookies", cookies),
});