import { writable } from "svelte/store";
import { LoadingState } from "./types";
import type { AnimeDetails, EpisodeInfo, EmbedInfo } from "./types";
import type { LogEntry } from "./logs/logApi";

export const loadingState = writable<LoadingState>(LoadingState.SUCCESS);
export const animeName = writable<string>("");
export const selectedAnimeId = writable<number>(0);
export const selectedAnime = writable<AnimeDetails>();
export const selectedEpisode = writable<EpisodeInfo>();
export const selectedPlayer = writable<EmbedInfo>();
export const logViewerStatus = writable<boolean>(false);
export const logs = writable<Array<LogEntry>>(new Array());
// TODO: Move this to some config
export const acceptedEmbedWarning = writable<boolean>(false);
