<script lang="ts">
	import ratingString from "$lib/ratingString";
	import type { AnimeDetails } from "$lib/types";

    export let animeDetails: AnimeDetails;
</script>

<div class="flex-1 grid grid-rows-3 items-center justify-center text-center text-white">
    <div class="text-xl">
        <p class="text-xl">Ocena</p>
        <p class="text-2xl">{ratingString(animeDetails)}</p>
    </div>
    <div>
        <p class="text-xl">Odcinki</p>
        <p class="text-2xl">{animeDetails.episode_count}</p>
    </div>
    <div>
        <p class="text-xl">Typ</p>
        <p class="text-2xl">{animeDetails.kind}</p>
    </div>
</div>