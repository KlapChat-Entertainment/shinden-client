<script lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { onMount } from 'svelte';
	import ResultsTable from "$lib/searchResult/resultsTable.svelte";
    import { loadingState } from "$lib/stores";
	import { LoadingState } from "$lib/types";
    import { animeName } from "$lib/stores";
    $loadingState = LoadingState.LOADING;

    onMount(async () => {
        try {
            const anime = await invoke('search_anime', { 'anime': $animeName });
            console.log(anime);
            $loadingState = LoadingState.SUCCESS;
        } catch(err) {
            console.error('Oh noes!', err);
            $loadingState = LoadingState.FAILED;
        }
    });

</script>

<div class="mx-4">
    <h2 class="text-white py-4">Wyniki wyszukiwania: {$animeName}</h2>
    <ResultsTable />
</div>
