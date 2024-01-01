<script lang="ts">
	import type { AnimeDetails } from "$lib/types";
	import { scale } from "svelte/transition";
	import AnimeImage from "./AnimeImage.svelte";
	import AnimeFullCardInfo from "./AnimeFullCardInfo.svelte";
	import AnimeNameHeader3 from "$lib/AnimeNameHeader3.svelte";
	import AnimeEpisodesList from "./AnimeEpisodesList.svelte";
	import AnimeDescription from "./AnimeDescription.svelte";
	export let animeDetails: AnimeDetails;
	
</script>

<div class="h-full flex gap-3 bg-gray-700 p-3 rounded-xl shadow-sm shadow-black" transition:scale>
	<div class="flex flex-col w-48">
		<AnimeImage animeDetails={animeDetails}/>
		<AnimeFullCardInfo animeDetails={animeDetails}/>
	</div>
	<div class="flex flex-1 flex-col">
		<div class="bg-gray-600 shadow-sm shadow-black rounded-xl h-2/3 pb-3">
			<div class="h-[10%]">
				<AnimeNameHeader3 anime={animeDetails}/>
			</div>
			<div class="h-[90%]">
				<AnimeEpisodesList animeDetails={animeDetails} />
			</div>
		</div>
		<div class="h-1/3 pt-3">
			<AnimeDescription animeDetails={animeDetails} />
		</div>
	</div>
	
</div>