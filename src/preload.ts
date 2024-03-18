// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    min: async() => ipcRenderer.send("min"),
    close: async() => ipcRenderer.send("close"),
    getVersion: async () => await ipcRenderer.invoke("getVersion"),
    openReleasePage: async () => await ipcRenderer.invoke("openReleasePage"),
    checkUpdates: async () => ipcRenderer.send("checkUpdates"),
    onUpdateStatusChange: (callback: ElectronAPICallbackFunctionOnUpdateStatusChange) => ipcRenderer.on("updateStatusChange", callback),
    onFinishLoading: (callback: ElectronAPICallbackFunctionOnFinishLoading) => ipcRenderer.on("finishLoading", callback)
});

contextBridge.exposeInMainWorld('shindenAPI', {
    searchAnime: async (name: string) => await ipcRenderer.invoke("searchAnime", name),
    getDescription: async (linkToSeries: string) => await ipcRenderer.invoke("getDescription", linkToSeries),
    getEpisodes: async (linkToSeries: string) => await ipcRenderer.invoke("getEpisodes", linkToSeries),
    getPlayers: async (episodeLink: string) => await ipcRenderer.invoke("getPlayers", episodeLink),
    getPlayer: async (onlineId: string) => await ipcRenderer.invoke("getPlayer", onlineId),
    login: async (loginData: string) => await ipcRenderer.invoke("login", loginData),
    clearCookies: async ()=> await ipcRenderer.invoke("clearCookies"),
    getLoginStatus: async ()=> await ipcRenderer.invoke("getLoginStatus"),
    getUserName: async ()=> await ipcRenderer.invoke("getUserName"),
    getUserProfileImage: async ()=> await ipcRenderer.invoke("getUserProfileImage")
});