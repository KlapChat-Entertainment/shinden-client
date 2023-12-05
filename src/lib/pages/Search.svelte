<script lang="ts">
	import ResultsTable from "$lib/searchResult/resultsTable.svelte";
    import { loadingState } from "$lib/stores";
	import { LoadingState } from "$lib/types";
    import { animeName } from "$lib/stores";
    $loadingState = LoadingState.LOADING;
    
    // TODO: anime search

    $loadingState = LoadingState.SUCCESS;

</script>

<div class="mx-4">
    <h2 class="text-white py-4">Wyniki wyszukiwania: {$animeName}</h2>
    <ResultsTable />
</div>
