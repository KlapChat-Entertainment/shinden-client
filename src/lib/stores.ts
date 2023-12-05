import { writable } from "svelte/store";
import { AppState, LoadingState } from "./types";


export const loadingState = writable<LoadingState>(LoadingState.SUCCESS);

export const appState = writable<AppState>(AppState.HOME);