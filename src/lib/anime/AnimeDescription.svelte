<script lang="ts">
	import type { AnimeDetails } from "$lib/types";

    export let animeDetails: AnimeDetails;
</script>

<div class="h-full py-3 bg-gray-600 shadow-sm shadow-black rounded-xl">
    <div class="overflow-y-auto h-full px-3">
        <p class="text-justify text-white">{animeDetails.description}</p>
    </div>
</div>