<script lang="ts">
	import { invoke } from '@tauri-apps/api/tauri';
	import AnimeFullCard from "$lib/anime/AnimeFullCard.svelte";
	import { selectedAnimeId, selectedAnime } from "$lib/stores";
	import type { AnimeDetails } from "$lib/types";
	import { onMount } from 'svelte';
	import { asyncTask } from '$lib/logs/logApi';

	let loadedAnimeDetails: AnimeDetails | null;

	onMount(asyncTask(async () => {
		// Loading episodes, description, cover image etc from specific $selectedAnimeId
		const anime: AnimeDetails = await invoke('get_anime_details', { 'onlineId': $selectedAnimeId });

		loadedAnimeDetails = anime;
		$selectedAnime = anime;
	}));

</script>

<div class="h-full p-4">
	{#if loadedAnimeDetails}
		<AnimeFullCard animeDetails={loadedAnimeDetails}/>
	{/if}
</div>
