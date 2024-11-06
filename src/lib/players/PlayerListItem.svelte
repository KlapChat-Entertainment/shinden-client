<script lang="ts">
	import LangIcon from "$lib/LangIcon.svelte";
	import type { PlayerInfo } from "$lib/types";
	import PlayerIcon from "./PlayerIcon.svelte";
	import PlayMethodList from "./PlayMethodList.svelte";

	export let player: PlayerInfo;
</script>

<li>
	<div class="bg-gray-500 text-left rounded-xl px-3 py-1 my-2 shadow-sm shadow-black w-full">
		<div class="flex gap-4">
			<div>{player.index + 1}.</div>
			<PlayerIcon player={player.source}/>
			<div class="w-10">{player.quality}</div>
			<div class="w-36">
				<div class="flex">
					<div class="w-28">Język audio:</div>
					<LangIcon langCode={player.audio_lang}/>
				</div>
				<div class="flex">
					<div class="w-28">Język napisów:</div>
					<LangIcon langCode={player.subtitle_lang}/>
				</div>
			</div>
			<PlayMethodList {player}/>
		</div>
	</div>
</li>
