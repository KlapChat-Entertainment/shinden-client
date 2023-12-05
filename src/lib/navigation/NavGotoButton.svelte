<script lang="ts">
	import { appState } from "$lib/stores";
	import type { AppState } from "$lib/types";

    export let where: AppState;
    export let value: string;

    async function goto() {
        $appState = where;
    }

</script>

<button type="button" class="text-white flex items-center w-fit h-full px-4 text-sm transition-colors hover:bg-gray-700" on:click={goto}>
    {value}
</button>