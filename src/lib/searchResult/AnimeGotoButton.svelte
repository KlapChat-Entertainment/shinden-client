<script lang="ts">
	import { goto } from "$app/navigation";
	import { selectedAnimeId } from "$lib/stores";
	import { AppState } from "$lib/types";
	import { onMount } from "svelte";

    export let name: string;
    export let id: number;

    async function buttonHandler() {
        $selectedAnimeId = id;
        await goto(AppState.ANIME);
    }

    onMount(async() => {
        if(name.length > 40) {
            name = name.substring(0, 40);
            name += "...";
        }
    });
</script>

<button type="submit" class="text-black bg-gray-400 w-fit px-5 py-1 rounded-3xl shadow-md shadow-black" on:click={buttonHandler}>
    {name}
</button>