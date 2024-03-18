import { IpcRendererEvent } from "electron";
import Anime from "./api/Anime"
import Episode from "./api/Episode";
import Player from "./api/Player";

export interface IElectronAPI {
    min: () => Promise<void>,
    close: () => Promise<void>
    getVersion: () => Promise<string>,
    openReleasePage: () => Promise<void>,
    checkUpdates: () => Promise<void>,
    onUpdateStatusChange: (callback: ElectronAPICallbackFunctionOnUpdateStatusChange) => Promise<void>,
    onFinishLoading: (callback: ElectronAPICallbackFunctionOnFinishLoading) => Proimse<void>
}

export interface IShindenAPI {
    searchAnime: (name: string) => Promise<Array<Anime>>,
    getDescription: (linkToSeries: string) => Promise<string>,
    getEpisodes: (linkToSeries: string) => Promise<Array<Episode>>,
    getPlayers: (episodeLink: string) => Promise<Array<Player>>,
    getPlayer: (onlineId: string) => Promise<string>,
    login: ({password: string, email: string}) => Promise<void>,
    clearCookies: () => Promise<void>,
    getLoginStatus: () => Promise<boolean>,
    getUserName: () => Promise<string | null>,
    getUserProfileImage() : Promise<string | null>
}

declare global {
    interface Window {
        electronAPI: EelectronAPI,
        shindenAPI: IShindenAPI
    }
    type ElectronAPICallbackFunctionOnUpdateStatusChange = (event: IpcRendererEvent, message: string) => void;
    type ElectronAPICallbackFunctionOnFinishLoading = (event: IpcRendererEvent, state: boolean) => void;
}