import { writable } from "svelte/store";
import { LoadingState } from "./types";

export const loadingState = writable<LoadingState>(LoadingState.SUCCESS);
export const animeName = writable<string>("");
export const selectedAnimeId = writable<number>(0);
