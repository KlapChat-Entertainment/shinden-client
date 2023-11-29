<script lang="ts">
	import NavButton from "./NavButton.svelte";
    import LoadingAnimation from "$lib/LoadingAnimation.svelte";
</script>

<header data-tauri-drag-region class="flex justify-between items-center w-full h-9 bg-gray-900 select-none cursor-move">
    <div class="flex items-center">
        <h1 data-tauri-drag-region class="text-white px-4 font-islandMoments font-bold text-3xl ">Shinden Client 4</h1>
        <LoadingAnimation />
    </div>
    <nav data-tauri-drag-region class="flex h-full flex-1 justify-end items-center">
        <NavButton buttonType="link" href="/" value="Wyszukiwarka" />
        <NavButton buttonType="back" />
        <NavButton buttonType="min" />
        <NavButton buttonType="close" />      
    </nav>
</header>

