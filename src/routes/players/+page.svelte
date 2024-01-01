<script lang="ts">
	import { loadingState, selectedEpisode } from "$lib/stores";
	import { LoadingState } from "$lib/types";
    
    $loadingState = LoadingState.LOADING;

    $loadingState = LoadingState.SUCCESS;

</script>

<!-- TODO: Players view -->

<div class="text-white">
    <p>Selected anime episode index: {$selectedEpisode.index}</p>
    <p>Selected anime episode name: {$selectedEpisode.name}</p>
    <p>Selected anime episode link: {$selectedEpisode.link}</p>
</div>
