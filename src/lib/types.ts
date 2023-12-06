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
    episode_count: number,
    image_link: string,
    kind: string,
    link_to_series: string,
    name: string,
    online_id: number,
    rating: number
}