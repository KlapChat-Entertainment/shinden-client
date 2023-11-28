<script lang="ts">
	import NavButton from "./NavButton.svelte";
</script>

<header data-tauri-drag-region class="flex justify-between items-center w-full h-9 bg-blue-900 select-none cursor-move">
    <h1 data-tauri-drag-region class="text-white px-4">Shinden Client 4.0</h1>
    <nav class="h-full">
        <NavButton buttonType="min" />
        <NavButton buttonType="close" />      
    </nav>
</header>

