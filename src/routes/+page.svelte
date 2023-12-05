<script lang="ts">
    import '$lib/app.css';
	import { appState } from '$lib/stores';
    import NavBar from '$lib/navigation/NavBar.svelte';
	import Home from '$lib/pages/Home.svelte';
	import Search from '$lib/pages/Search.svelte';
	import { AppState } from '$lib/types';
	import Anime from '$lib/pages/Anime.svelte';
	import Players from '$lib/pages/Players.svelte';
	import Watching from '$lib/pages/Watching.svelte';
</script>

<!--
    Window height = 700px
    Navbar height (h-9 = 36px)
    Main app container fixed height 664px and width 100%
-->

<NavBar />

<div class="h-[664px] w-full overflow-y-auto bg-gray-800">
    {#if $appState == AppState.HOME}
        <Home />
    {:else if $appState == AppState.SEARCH}
        <Search />
    {:else if $appState == AppState.ANIME}
        <Anime />
    {:else if $appState == AppState.PLAYERS}
        <Players />
    {:else if $appState == AppState.WATCHING}
        <Watching />
    {/if}
</div>
