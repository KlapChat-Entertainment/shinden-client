<script lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { onMount } from 'svelte';
	import ResultsTable from "$lib/searchResult/ResultsTable.svelte";
    import { loadingState } from "$lib/stores";
	import { LoadingState, type AnimeSearchResult, AppState } from "$lib/types";
    import { animeName } from "$lib/stores";
	import { goto } from '$app/navigation';
    $loadingState = LoadingState.LOADING;

    let results: Array<AnimeSearchResult> = new Array<AnimeSearchResult>();

    onMount(async () => {
        if(!$animeName) {
            await goto(AppState.HOME);
            return;
        }
        try {
            const anime = await invoke<Array<AnimeSearchResult>>('search_anime', { 'anime': $animeName });

            if(anime.length > 0) {
                anime.sort((a, b)=>{
                    return b.rating - a.rating;
                });

                results = [...anime];
                
                $loadingState = LoadingState.SUCCESS;
            } else {
                $loadingState = LoadingState.WARNING;
            }
        } catch(err) {
            console.error('Oh noes!', err);
            $loadingState = LoadingState.FAILED;
        }
    });

</script>

<div class="m-4">
    <h2 class="text-white pb-4">Wyniki wyszukiwania: {$animeName}</h2>
    <ResultsTable searchResults={results}/>
</div>
