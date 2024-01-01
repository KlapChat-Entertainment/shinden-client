<script lang="ts">
	import NavButton from "./NavButton.svelte";
    import LoadingAnimation from "$lib/LoadingAnimation.svelte";
	import NavGotoButton from "./NavGotoButton.svelte";
	import { AppState } from "$lib/types";
</script>

<header data-tauri-drag-region class="flex justify-between items-center w-full h-9 bg-gray-900 select-none cursor-move">
    <div class="flex items-center">
        <h1 data-tauri-drag-region class="text-white px-4 font-logo text-xl ">Shinden Client 4</h1>
        <LoadingAnimation />
    </div>
    <nav data-tauri-drag-region class="flex h-full flex-1 justify-end items-center">
        <NavGotoButton where={AppState.HOME} value="Wyszukiwarka"/>
        <NavButton buttonType="back" />
        <NavButton buttonType="min" />
        <NavButton buttonType="close" />      
    </nav>
</header>

