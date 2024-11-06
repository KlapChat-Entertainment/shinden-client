<script lang="ts">
	import { getPlayers } from "$lib/api";
	import { selectedAnime } from "$lib/stores";
	import type { EpisodeInfo, PlayerInfo } from "$lib/types";
	import { onMount } from "svelte";
	import PlayerListItem from '$lib/players/PlayerListItem.svelte';
	import { asyncTask } from "$lib/logs/logApi";

	export let episodeInfo: EpisodeInfo;

	let players: Array<PlayerInfo> = [];

	onMount(asyncTask(async () => {
		players = await getPlayers($selectedAnime, episodeInfo);
	}));
</script>

<ol class="text-white py-1 overflow-y-scroll h-full px-3">
	{#each players as player}
		<PlayerListItem {player}/>
	{/each}
</ol>
