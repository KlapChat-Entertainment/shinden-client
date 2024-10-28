import { invoke } from "@tauri-apps/api/tauri";
import type { AnimeDetails, EpisodeInfo, PlayerInfo } from "./types";

export type StringStoreKey = 'source' | 'quality' /*| 'lang'*/;
export type StringStores = Record<StringStoreKey, string[]>;

export const stringStores: StringStores = {
	'source': [],
	'quality': [],
	//'lang': [],
};

async function fetchStrings() {
	const response: StringStores = await invoke('get_interned_strings', {
		'sourceFrom': stringStores.source.length,
		'qualityFrom': stringStores.quality.length,
		//'langFrom': stringStores.lang.length,
	});
	for (const key of Object.getOwnPropertyNames(response) as StringStoreKey[]) {
		stringStores[key].push(...response[key]);
	}
}

export async function getIndexedString(store: StringStoreKey, index: number): Promise<string> {
	const arr = stringStores[store];
	if (index >= arr.length) {
		await fetchStrings();
		if (index >= arr.length)
			throw RangeError('String out of range');
	}
	return arr[index];
}

export function getIndexedStringNoFetch(store: StringStoreKey, index: number): string {
	return stringStores[store][index];
}

export function getLanguageFromCode(code: number): string {
	return code === 0 ? '' : String.fromCharCode((code >> 8) & 0xFF, code & 0xFF);
}

type RawPlayer = {
	source: number;
	quality: number;
	audio_lang: number;
	subtitle_lang: number;
};

export async function getPlayers(anime: AnimeDetails, episode: EpisodeInfo) {
	const list: RawPlayer[] = await invoke('get_episode_player_list', { 'animeId': anime.online_id, 'episodeIndex': episode.index });
	await fetchStrings();
	let index = 0;
	for (const player of list) {
		const nplayer = player as unknown as PlayerInfo;
		nplayer.index = index;
		nplayer.source = getIndexedStringNoFetch('source', player.source);
		nplayer.quality = getIndexedStringNoFetch('quality', player.source);
		nplayer.audio_lang = getLanguageFromCode(player.audio_lang);
		nplayer.subtitle_lang = getLanguageFromCode(player.subtitle_lang);
		++index;
	}
	return list as unknown[] as PlayerInfo[];
}

export async function getPlayerEmbed(anime: AnimeDetails, episode: EpisodeInfo, player: PlayerInfo) {
	return await invoke<string>('get_player_embed', { 'animeId': anime.online_id, 'episodeIndex': episode.index, 'playerIndex': player.index });
}
