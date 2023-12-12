<script lang="ts">
	import { goto } from "$app/navigation";
	import AnimeNameHeader3 from "$lib/AnimeNameHeader3.svelte";
	import ratingString from "$lib/ratingString";
	import { selectedAnimeId } from "$lib/stores";
	import { AppState, type AnimeSearchResult } from "$lib/types";
	import { scale } from "svelte/transition";
    export let anime: AnimeSearchResult;

    async function handleClick() {
        $selectedAnimeId = anime.online_id;
        await goto(AppState.ANIME);
    }
</script>

<button type="button" class="flex bg-gray-700 p-3 rounded-xl shadow-sm shadow-black items-stretch" on:click={handleClick} transition:scale>
    <div class="flex items-center">
        <img src={anime.image_link} alt={anime.name} class="w-28 rounded-xl shadow-md shadow-black">
    </div>
    <div class="flex flex-1 flex-col text-center">
        <AnimeNameHeader3 anime={anime} />
        <div class="grid grid-cols-3 text-white flex-1 items-center">
            <div class="text-xl font-bold">Ocena</div>
            <div class="text-xl font-bold">Odcinki</div>
            <div class="text-xl font-bold">Typ</div>
            <div class="text-2xl">{ratingString(anime)}</div>
            <div class="text-2xl">{anime.episode_count}</div>
            <div class="text-2xl">{anime.kind}</div>
        </div>
    </div>
</button>
