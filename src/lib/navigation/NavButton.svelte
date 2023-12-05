<script lang="ts">
	import { appState } from '$lib/stores';
	import { AppState } from '$lib/types';
    import { appWindow } from '@tauri-apps/api/window';
    
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
            switch($appState) {
                case AppState.HOME:
                    break;
                case AppState.SEARCH:
                    $appState = AppState.HOME;
                    break;
                case AppState.ANIME:
                    $appState = AppState.SEARCH;
                    break;
                case AppState.PLAYERS:
                    $appState = AppState.ANIME;
                    break;
                case AppState.WATCHING:
                    $appState = AppState.PLAYERS;
                    break;
                default:
                    $appState = AppState.HOME;
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


