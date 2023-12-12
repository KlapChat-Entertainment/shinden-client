<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import AnimeFullCard from "$lib/anime/AnimeFullCard.svelte";
	import { loadingState, selectedAnimeId } from "$lib/stores";
	import { LoadingState, type AnimeDetails } from "$lib/types";
	import { onMount } from 'svelte';
	$loadingState = LoadingState.LOADING;

	let loadedAnimeDetails: AnimeDetails | null;

	onMount(async () => {
		try {
			// Loading episodes, description, cover image etc from specific $selectedAnimeId
			const anime: AnimeDetails = await invoke('get_anime_details', { 'onlineId': $selectedAnimeId });

			loadedAnimeDetails = anime;

			$loadingState = LoadingState.SUCCESS;
		} catch(err) {
			console.error('Oh noes!', err);
			$loadingState = LoadingState.FAILED;
		}
	});

</script>

<!-- TODO: Anime view -->

<div class="h-full p-4">
	{#if loadedAnimeDetails}
		<AnimeFullCard animeDetails={loadedAnimeDetails}/>
	{/if}
</div>
