<script lang="ts">
    import '$lib/app.css';
    import LogViewer from '$lib/logs/LogViewer.svelte';
	import { LogLevel, log } from '$lib/logs/logApi';
    import NavBar from '$lib/navigation/NavBar.svelte';

    log(LogLevel.SUCCESS, "Frontend loaded");
</script>

<!--
    Window height = 700px
    Navbar height (h-9 = 36px)
    Main app container fixed height 664px and width 100%
-->

<NavBar />

<div class="h-[664px] w-full overflow-y-auto bg-gray-800">
    <slot />
</div>

<LogViewer />