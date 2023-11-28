<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window';
    
    type buttonActionType = "min" | "close";
    
    export let buttonType: buttonActionType;

    async function buttonAction() {
        if(buttonType == "min") {
            await appWindow.minimize();
        } else if(buttonType == "close") {
            await appWindow.close();
        }
    }
</script>

<button type="button" class="text-white w-12 h-full text-center text-xl transition-colors hover:bg-blue-700" on:click={buttonAction}>
    {#if buttonType == "min"}
        &#95;
    {:else if buttonType == "close"}
        &times;
    {/if}
</button>

