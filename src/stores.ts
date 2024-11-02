import { writable } from 'svelte/store';

// A store of the active quadkeys
export const quadkeys = writable<string[]>([]);

// Whether to support selecting multiple quadkeys at once on the map.
export const multiSelect = writable<boolean>(false);
