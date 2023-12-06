<script lang="ts">
    import type { AnimeSearchResult } from "$lib/types";
	import AnimeCard from "./AnimeCard.svelte";
    export let searchResults: Array<AnimeSearchResult>;
</script>

<div class="w-full flex flex-col gap-5">
    {#each searchResults as anime}
        <AnimeCard anime={anime} />
    {/each}
</div>