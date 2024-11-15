import { writable } from 'svelte/store';
import type { FeatureCollection } from 'geojson';

// A store of the active quadkeys
export const quadkeys = writable<string[]>([]);

// Whether to support selecting multiple quadkeys at once on the map.
export const multiSelect = writable<boolean>(false);

export const showImportModal = writable<boolean>(true);

export const inputGeojson = writable<FeatureCollection | null>(null);

export const inputZoom = writable<number>(4);
