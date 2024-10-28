<script lang="ts">
	import { loadingState, selectedEpisode, selectedAnime } from "$lib/stores";
	import { LoadingState, type PlayerInfo } from "$lib/types";
	import { onMount } from "svelte";
    import { getPlayerEmbed, getPlayers } from '$lib/api';

    $loadingState = LoadingState.LOADING;

    $loadingState = LoadingState.SUCCESS;

    let players: Array<PlayerInfo> = [];
    let embed: string = '';

    onMount(async () => {
        try {
            players = await getPlayers($selectedAnime, $selectedEpisode);
            console.log(players);
            const player = players[Math.floor(Math.random() * players.length)];
            if (player != null) {
                embed = await getPlayerEmbed($selectedAnime, $selectedEpisode, player);
            }

            $loadingState = LoadingState.SUCCESS;
        } catch(err) {
            console.error('Oh noes!', err);
            $loadingState = LoadingState.FAILED;
        }
    });
</script>

<!-- TODO: Players view -->

<div class="text-white">
    <p>Selected anime episode index: {$selectedEpisode.index}</p>
    <p>Selected anime episode name: {$selectedEpisode.name}</p>
    <p>Selected anime episode link: {$selectedEpisode.link}</p>

    {#each players as player}
        <p>Player: {player.source} audio={player.audio_lang} subs={player.subtitle_lang}</p>
    {/each}
    {#if embed}
        <p>Embed:</p>
        <blockquote style="color: gray; white-space: pre; font-family: monospace;">{embed}</blockquote>
    {/if}
</div>
