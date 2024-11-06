<script lang="ts">
	import { selectedEpisode } from "$lib/stores";
	import EpisodeFullCard from "$lib/episode/EpisodeFullCard.svelte";
</script>

<div class="h-full p-4">
	<EpisodeFullCard episodeInfo={$selectedEpisode}/>
</div>
