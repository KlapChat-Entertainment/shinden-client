<script lang="ts">
	export let url: string;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video class="w-full h-full" controls>
	<source src={url} />
</video>
