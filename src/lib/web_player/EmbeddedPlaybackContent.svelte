<script lang="ts">
	export let content: string;
</script>


<!-- {@html content} -->
<iframe class="w-full h-full" title="Ramka odwarzacza" sandbox="allow-scripts allow-presentation" srcdoc={content} />
