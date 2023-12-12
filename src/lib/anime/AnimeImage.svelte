<script lang="ts">
	import type { AnimeDetails } from "$lib/types";

    export let animeDetails: AnimeDetails;
</script>

<img src={animeDetails.image_link} alt={animeDetails.name} class="w-48 rounded-xl shadow-md shadow-black">