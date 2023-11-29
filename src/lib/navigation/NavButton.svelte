<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window';
    
    type buttonActionType = "min" | "close" | "link" | "back";

    const SYMBOLS = {
        "min": "&#95;",
        "close": "&times;",
        "back": "&larr;"
    }
    
    export let buttonType: buttonActionType;
    
    // Required only when buttonType is link.
    export let href : string = "";
    export let value: string = "";

    async function buttonAction() {
        if(buttonType == "min") {
            await appWindow.minimize();
        } else if(buttonType == "close") {
            await appWindow.close();
        } else if(buttonType == "back") {
            window.history.back();
        }
    }
</script>



{#if buttonType != "link"}
    <button 
        type="button" 
        class="text-white w-12 h-full text-center text-xl transition-colors hover:bg-gray-700" 
        on:click={buttonAction}>
        {@html SYMBOLS[buttonType] }
    </button>
{:else if buttonType == "link"}
    <a href={href} class="text-white flex items-center w-fit h-full px-4 text-sm transition-colors hover:bg-gray-700">
        {value}
    </a>
{/if}

