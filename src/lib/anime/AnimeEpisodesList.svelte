<script lang="ts">
	import type { AnimeDetails } from "$lib/types";
	import AnimeListItem from "./AnimeListItem.svelte";

    export let animeDetails: AnimeDetails;

    animeDetails.episode_list;
</script>

<ol class="text-white py-1 overflow-y-scroll h-full px-3">
    {#each animeDetails.episode_list as episode}
        <AnimeListItem episode={episode}/>
    {/each}
</ol>
