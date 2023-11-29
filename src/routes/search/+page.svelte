<script lang="ts">
    import { page } from "$app/stores";
	import ResultsTable from "$lib/searchResult/resultsTable.svelte";
    import { loadingState } from "$lib/stores";
    $loadingState = "loading";
    
    let animeName = $page.url.searchParams.get('animeName');
    
    // TODO: anime search

    $loadingState = "success";

</script>

<div class="mx-4">
    <h2 class="text-white py-4">Wyniki wyszukiwania: {animeName}</h2>
    <ResultsTable />
</div>
