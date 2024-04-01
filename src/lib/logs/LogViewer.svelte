<script lang="ts">
	import { logViewerStatus, logs } from "$lib/stores";
	import { fly, scale, slide } from "svelte/transition";
	import LogEntry from "./LogEntry.svelte";

    async function handleClick() {
        $logViewerStatus=!$logViewerStatus;
    }
</script>

{#if $logViewerStatus}
    <div class="bg-black h-[664px] w-full fixed left-0 bottom-0 p-3 bg-opacity-90" transition:slide>
        <div class="h-full w-full border-white border flex flex-col">
            <div class="m-3 border-b-white border-b text-white flex justify-between items-center">
                <p class="font-logo text-sm">Logi:</p>
                <button type="button" class="text-xl" on:click={handleClick}>&times;</button>
            </div>
            <ul class="mx-3 overflow-y-auto">
                {#each $logs as log}
                    <LogEntry log={log} />
                {/each}
            </ul>
        </div>
    </div>
{/if}
