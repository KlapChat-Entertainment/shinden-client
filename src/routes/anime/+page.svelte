<script lang="ts">
	import AnimeFullCard from "$lib/anime/AnimeFullCard.svelte";
	import { loadingState, selectedAnimeId } from "$lib/stores";
	import { LoadingState } from "$lib/types";
	$loadingState = LoadingState.LOADING;

	// Loading episodes, description, cover image etc from specific $selectedAnimeId

	$loadingState = LoadingState.SUCCESS;
</script>

<!-- TODO: Anime view -->

<div class="h-full p-4">
	<AnimeFullCard />
</div>