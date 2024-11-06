<script lang="ts">
	import type { EpisodeInfo } from "$lib/types";

	export let episodeInfo: EpisodeInfo;
</script>

<div class="flex-1 grid grid-rows-3 items-center justify-center text-center text-white">
	<div class="flex items-center justify-center h-full text-xl">
		<p class="text-xl px-4">Odcinek</p>
		<p class="text-2xl">{episodeInfo.index}</p>
	</div>
	<div>
		<p class="text-xl">Nazwa</p>
		<p class="text-2xl">{episodeInfo.name}</p>
	</div>
</div>
