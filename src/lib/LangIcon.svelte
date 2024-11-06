<script lang="ts">
	import { onMount } from "svelte";

	export let langCode: string;

	onMount(() => {
		langCode = langCode.toLowerCase().replaceAll('-', '_');

		// Temporary: assume "en" refers to US
		if (langCode === 'en') {
			langCode = 'en_us';
		}
	})
</script>

<img class="h-4" title={langCode} alt={langCode} src="/images/lang/{langCode}.svg" />
