<script lang="ts">
	import type { AnimeDetails } from "$lib/types";

    export let animeDetails: AnimeDetails;
</script>

<div class="h-full overflow-y-auto bg-gray-600 shadow-sm shadow-black rounded-xl ">
    <p class="text-justify text-white px-3 py-1">{animeDetails.description}</p>
</div>