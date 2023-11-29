<script lang="ts">
	import NavButton from "./NavButton.svelte";
    import { page } from '$app/stores';
</script>

<header data-tauri-drag-region class="flex justify-between items-center w-full h-9 bg-gray-900 select-none cursor-move">
    <h1 data-tauri-drag-region class="text-white px-4 font-islandMoments font-bold text-3xl ">Shinden Client 4</h1>
    <nav data-tauri-drag-region class="flex h-full flex-1 justify-end items-center">
        <NavButton buttonType="min" />
        <NavButton buttonType="close" />      
    </nav>
</header>

