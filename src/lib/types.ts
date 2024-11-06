export enum LoadingState {
    LOADING,
    FAILED,
    SUCCESS,
    WARNING
};

export enum AppState {
    HOME = "/",
    SEARCH = "/search",
    ANIME = "/anime",
    PLAYERS = "/players",
    WATCHING = "/watching"
};

export type AnimeSearchResult = {
    name: string,
    link_to_series: string,
    image_link: string,
    description: string | null,
    kind: string,
    rating: number | null,
    episode_count: number,
    online_id: number,
};

export type AnimeDetails = AnimeSearchResult & {
    description: string,
    episode_list: Array<EpisodeInfo>,
};

export type EpisodeInfo = {
    name: string,
    index: number,
    link: string,
};

export type PlayerInfo = {
    index: number,
    source: string,
    quality: string,
    audio_lang: string,
    subtitle_lang: string,
};

export type EmbedInfo = {
    original?: string,
    embed: string,
    direct_link?: string,
};
