<script lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { onMount } from 'svelte';
    import ResultsTable from "$lib/searchResult/ResultsTable.svelte";
    import { LoadingState, AppState, type AnimeSearchResult } from "$lib/types";
    import { animeName } from "$lib/stores";
    import { goto } from '$app/navigation';
    import { asyncTask } from '$lib/logs/logApi';

    let results: Array<AnimeSearchResult> = new Array<AnimeSearchResult>();

    onMount(async () => {
        if(!$animeName) {
            await goto(AppState.HOME);
            return;
        }
        await asyncTask(async () => {
            const anime = await invoke<Array<AnimeSearchResult>>('search_anime', { 'anime': $animeName });

            if(anime.length > 0) {
                anime.sort((a, b)=>{
                    return b.rating == null ? -1 :
                        a.rating == null ? 1 :
                        b.rating - a.rating;
                });

                results = anime;

                return LoadingState.SUCCESS;
            } else {
                return LoadingState.WARNING;
            }
        })();
    });

</script>

<div class="m-4">
    <h2 class="text-white pb-4">Wyniki wyszukiwania: {$animeName}</h2>
    <ResultsTable searchResults={results}/>
</div>
