import { writable } from "svelte/store";

export const loadingState = writable<"loading" | "failed" | "success" | "warning">("success");
