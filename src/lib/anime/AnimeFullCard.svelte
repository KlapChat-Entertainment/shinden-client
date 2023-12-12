<script lang="ts">
	import type { AnimeDetails } from "$lib/types";
	import { scale } from "svelte/transition";
	import AnimeImage from "./AnimeImage.svelte";
	import AnimeFullCardInfo from "./AnimeFullCardInfo.svelte";
	import AnimeNameHeader3 from "$lib/AnimeNameHeader3.svelte";
	export let animeDetails: AnimeDetails;
	
</script>

<div class="h-full flex gap-3 bg-gray-700 p-3 rounded-xl shadow-sm shadow-black" transition:scale>
	<div class="flex flex-col w-48">
		<AnimeImage animeDetails={animeDetails}/>
		<AnimeFullCardInfo animeDetails={animeDetails}/>
	</div>
	<div class="bg-gray-600 flex-1 shadow-sm shadow-black rounded-xl">
		<AnimeNameHeader3 anime={animeDetails}/>
		<!-- TODO: Episodes list and description -->
	</div>
</div>