<script lang="ts">
	import { acceptedEmbedWarning } from "$lib/stores";
	import type { EmbedInfo } from "$lib/types";
	import { onMount } from "svelte";
	import EmbeddedPlaybackContent from "./EmbeddedPlaybackContent.svelte";

	export let embed: EmbedInfo;
	let content: string;
	let playbackAllowed = $acceptedEmbedWarning;
	let loaded = false;

	onMount(() => {
		if (embed.embed) {
			content = embed.embed;
		} else {
			content = embed.original ?? '';
		}
		loaded = true;
	});

	function playThisTime() {
		playbackAllowed = true;
	}

	function playAlways() {
		$acceptedEmbedWarning = true;
		playbackAllowed = true;
	}
</script>

{#if loaded}
	{#if playbackAllowed}
		<EmbeddedPlaybackContent {content} />
	{:else}
		<div class="content-center w-full h-full text-orange-300 p-10">
			<p class="font-bold text-xl justify-center">
				Nie znaleziono źródła bezpośredniego. Czy chcesz użyć ramki zewnętrznego źrodła?
				Może ona zawierać reklamy lub inne niepożądane treści.
				Możesz wrócić do listy odtwarzaczy klikając strzałkę na pasku nawigacyjnym.
			</p>
			<div class="flex gap-20 items-center m-10 text-purple-500 font-extrabold text-2xl">
				<button on:click={playThisTime} class="bg-green-300 p-3 border rounded-xl">Odtwórz tym razem</button>
				<button on:click={playAlways} class="bg-orange-300 p-3 border rounded-xl">Odtwórz i nie pytaj więcej</button>
			</div>
		</div>
	{/if}
{/if}
