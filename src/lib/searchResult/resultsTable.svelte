<script lang="ts">
    import type { AnimeSearchResult } from "$lib/types";
	import AnimeGotoButton from "./AnimeGotoButton.svelte";
    export let searchResults: Array<AnimeSearchResult>;
</script>

<table class="w-full border-black border">
    <tr class="text-white">
        <th class="border-black border">Okładka</th>
        <th class="border-black border">Nazwa</th>
        <!-- We may have to limit the name of the anime so that it doesn't ruin the interface when it gets too long. -->
        <th class="border-black border">Typ</th>
        <th class="border-black border">Epizody</th>
        <th class="border-black border">Ocena</th>
    </tr>
    {#each searchResults as anime}
        <tr class="text-center text-white border-black border">
            <td class="text-center border-black border p-4">
                <img class="w-28 mx-auto shadow-lg shadow-black" src={anime.image_link} alt="{anime.name}">
            </td>
            <td class="border-black border">
                <AnimeGotoButton name={anime.name} id={anime.online_id} />
            </td>
            <td class="border-black border">{anime.kind}</td>
            <td class="border-black border">{anime.episode_count}</td>
            <td class="border-black border">{anime.rating.toFixed(2)}</td>
        </tr>
    {/each}
</table>