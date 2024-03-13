import Anime from "./api/Anime"
import Episode from "./api/Episode";
import Player from "./api/Player";

export interface IElectronAPI {
    min: () => Promise<void>,
    close: () => Promise<void>
}

export interface IShindenAPI {
    searchAnime: (name: string) => Promise<Array<Anime>>,
    getDescription: (linkToSeries: string) => Promise<string>,
    getEpisodes: (linkToSeries: string) => Promise<Array<Episode>>,
    getPlayers: (episodeLink: string) => Promise<Array<Player>>,
    getPlayer: (onlineId: string) => Promise<string>,
    login: () => Promise<void>,
    clearCookies: () => Promise<void>,
    getCookies: () => Promise<string>,
    setCookies: () => Promise<void>
}

declare global {
    interface Window {
        electronAPI: EelectronAPI,
        shindenAPI: IShindenAPI
    }
}