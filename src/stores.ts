import { writable } from 'svelte/store';

export const quadkeys = writable<string[]>([]);
export const multiSelect = writable<boolean>(false);
