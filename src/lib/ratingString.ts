import type { AnimeSearchResult } from "./types";


export default function ratingString(anime: AnimeSearchResult) {
    return anime.rating == null ? 'Brak' : `${anime.rating.toFixed(2)} / 10`;
}