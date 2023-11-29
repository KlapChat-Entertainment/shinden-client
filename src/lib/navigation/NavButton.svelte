<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window';
    
    type buttonActionType = "min" | "close" | "link";
    
    export let buttonType: buttonActionType;
    
    // Required only when buttonType is link.
    export let href : string = "";
    export let value: string = "";

    async function buttonAction() {
        if(buttonType == "min") {
            await appWindow.minimize();
        } else if(buttonType == "close") {
            await appWindow.close();
        }
    }
</script>



{#if buttonType == "min" || buttonType == "close"}
    <button 
        type="button" 
        class="text-white w-12 h-full text-center text-xl transition-colors hover:bg-gray-700" 
        on:click={buttonAction}>
        {@html ((buttonType == "min") ? "&#95;" : "&times;") }
    </button>
{:else if buttonType == "link"}
    <a href={href} class="text-white flex items-center w-fit h-full px-4 text-sm transition-colors hover:bg-gray-700">
        {value}
    </a>
{/if}

