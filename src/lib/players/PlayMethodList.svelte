<script lang="ts">
	import { goto } from "$app/navigation";
	import { getPlayerEmbed, launchExternalPlayer } from "$lib/api";
	import { log, LogLevel, asyncTask } from "$lib/logs/logApi";
	import { selectedAnime, selectedEpisode, selectedPlayer } from "$lib/stores";
	import { AppState, type PlayerInfo, type EmbedInfo } from "$lib/types";

	export let player: PlayerInfo;
	let embed: EmbedInfo | null = null;

	const anime = $selectedAnime;
	const episode = $selectedEpisode;

	async function getEmbed() {
		if (embed != null)
			return embed;

		log(LogLevel.INFO, 'Fetching embed');
		embed = await getPlayerEmbed(anime, episode, player);
		//log(LogLevel.INFO, JSON.stringify(embed));
		return embed;
	}

	async function playMpv() {
		const embed = await getEmbed();
		if (embed.direct_link == null)
			throw new Error('No direct link found');

		await launchExternalPlayer(embed.direct_link);
	}

	async function playVideo() {
		const embed = await getEmbed();
		if (embed.direct_link == null && embed.embed == null)
			throw new Error('No embed found');

		$selectedPlayer = embed;
		await goto(AppState.WATCHING);
	}
</script>

<div>
	<span class="text-center text-sm">Odtwórz: </span>
	<div class="flex">
		<button on:click={asyncTask(playMpv)}>
			<img src="/images/players/mpv.png" width="32" height="32" alt="mpv" />
		</button>
		<button on:click={asyncTask(playVideo)}>
			<img src="/images/players/html.svg" width="32" height="32" alt="HTML Video" />
		</button>
	</div>
</div>
