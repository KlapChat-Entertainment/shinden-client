<script lang="ts">
	import { goto } from "$app/navigation";
	import { selectedEpisode } from "$lib/stores";
    import { AppState, type EpisodeInfo } from "$lib/types";
    export let episode: EpisodeInfo;

    async function handleClick() {
        $selectedEpisode = episode;
        await goto(AppState.PLAYERS);
    }
</script>

<li>
    <button on:click={handleClick} class="bg-gray-500 text-left rounded-xl px-3 py-1 my-2 shadow-sm shadow-black w-full">
        {episode.index}. {episode.name ? episode.name : "Brak nazwy odcinka"}
    </button>
</li>