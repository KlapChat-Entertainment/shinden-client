<script lang="ts">
	import type { AnimeDetails } from "$lib/types";

    export let animeDetails: AnimeDetails;

    animeDetails.episode_list;
</script>

<ol class="text-white py-1 overflow-y-scroll h-full px-3 list-decimal list-inside">
    {#each animeDetails.episode_list as episode}
        <li class="bg-gray-500 rounded-xl px-3 py-1 my-2 shadow-sm shadow-black">{episode.name}</li>
    {/each}
</ol>
