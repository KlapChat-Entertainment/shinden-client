import { invoke } from "@tauri-apps/api/tauri";

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
	return String.fromCharCode((code >> 8) & 0xFF, code & 0xFF);
}
