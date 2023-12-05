<script lang="ts">
    import { page } from "$app/stores";
	import ResultsTable from "$lib/searchResult/resultsTable.svelte";
    import { loadingState } from "$lib/stores";
	import { LoadingState } from "$lib/types";
    $loadingState = LoadingState.LOADING;
    
    // TODO: anime search

    $loadingState = LoadingState.SUCCESS;

</script>

<div class="mx-4">
    <h2 class="text-white py-4">Wyniki wyszukiwania: </h2>
    <ResultsTable />
</div>
