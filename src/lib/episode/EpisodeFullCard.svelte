<script lang="ts">
	import type { EpisodeInfo as TEpisodeInfo } from "$lib/types";
	import EpisodeInfo from "./EpisodeInfo.svelte";
	import { scale } from "svelte/transition";
	import PlayersList from "./PlayersList.svelte";

	export let episodeInfo: TEpisodeInfo;
</script>

<div class="h-full flex gap-3 bg-gray-700 p-3 rounded-xl shadow-sm shadow-black" transition:scale>
	<div class="flex flex-col w-72">
		<EpisodeInfo {episodeInfo}/>
	</div>
	<div class="flex flex-1 flex-col">
		<div class="bg-gray-600 shadow-sm shadow-black rounded-xl h-2/3 pb-3">
			<PlayersList {episodeInfo}/>
		</div>
	</div>
</div>
