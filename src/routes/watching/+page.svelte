<script lang="ts">
	import { asyncTask } from "$lib/logs/logApi";
	import { selectedPlayer } from "$lib/stores";
	import type { EmbedInfo } from "$lib/types";
	import DirectVideoPlayer from "$lib/web_player/DirectVideoPlayer.svelte";
	import EmbedView from "$lib/web_player/EmbedView.svelte";
	import { onMount } from "svelte";

	let embed: EmbedInfo;
	let player;
	let video_link: string | null;
	let loaded = false;

	onMount(asyncTask(async () => {
		embed = $selectedPlayer;
		//if (embed.direct_link) {}
		// We don't have API for scrapping direct links yet
		video_link = null;
		loaded = true;
	}));
</script>

{#if loaded}
	{#if video_link}
		<DirectVideoPlayer bind:this={player} url={video_link} />
	{:else}
		<EmbedView bind:this={player} {embed} />
	{/if}
{/if}
