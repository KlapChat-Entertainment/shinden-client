<script lang="ts">
	import LangIcon from "$lib/LangIcon.svelte";
	import type { PlayerInfo } from "$lib/types";
	import PlayerIcon from "./PlayerIcon.svelte";

	export let player: PlayerInfo;
</script>

<li>
	<div class="bg-gray-500 text-left rounded-xl px-3 py-1 my-2 shadow-sm shadow-black w-full">
		<div class="flex gap-4">
			<div>{player.index + 1}.</div>
			<PlayerIcon player={player.source}/>
			<div class="w-10">{player.quality}</div>
			<div>
				<span>Język audio: </span>
				<LangIcon langCode={player.audio_lang}/>
			</div>
			<div>
				<span>Język napisów: </span>
				<LangIcon langCode={player.subtitle_lang}/>
			</div>
		</div>
	</div>
</li>
