<script lang="ts">
	import { goto } from "$app/navigation";
	import type { AppState } from "$lib/types";

    export let where: AppState;
    export let value: string;

    async function buttonHandler() {
        await goto(where);
    }

</script>

<button type="button" class="text-white flex items-center w-fit h-full px-4 text-sm transition-colors hover:bg-gray-700" on:click={buttonHandler}>
    {value}
</button>