<script lang="ts">
	import { goto } from '$app/navigation';
	import { AppState } from '$lib/types';
    import { appWindow } from '@tauri-apps/api/window';
    import { page } from '$app/stores';
    
    type buttonActionType = "min" | "close" | "back";

    const SYMBOLS = {
        "min": "&#95;",
        "close": "&times;",
        "back": "&larr;"
    }
    
    export let buttonType: buttonActionType;

    async function buttonAction() {
        if(buttonType == "min") {
            await appWindow.minimize();
        } else if(buttonType == "close") {
            await appWindow.close();
        } else if(buttonType == "back") {
            switch($page.url.pathname) {
                case AppState.HOME:
                    break;
                case AppState.SEARCH:
                    await goto(AppState.HOME);
                    break;
                case AppState.ANIME:
                    await goto(AppState.SEARCH);
                    break;
                case AppState.PLAYERS:
                await goto(AppState.HOME);
                    await goto(AppState.ANIME);
                    break;
                case AppState.WATCHING:
                    await goto(AppState.PLAYERS);
                    break;
                default:
                    await goto(AppState.HOME);
                    break;
            }
        }
    }
</script>




<button 
    type="button" 
    class="text-white w-12 h-full text-center text-xl transition-colors hover:bg-gray-700" 
    on:click={buttonAction}>
    {@html SYMBOLS[buttonType] }
</button>


