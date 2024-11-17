import { quadkeyToTile, tileToQuadkey } from '@mapbox/tilebelt';
import { quadkeys } from '../../stores';
import { get } from 'svelte/store';

export function handleArrowPress(currentQuadkey: string, direction: string) {
	/** Get the quadkey in the direction of the arrow key
	 *
	 * @param {string} currentQuadkey
	 * @param {string} 'up' | 'left' | 'down' | 'right'
	 * @returns {string | null}
	 * */
	if (!currentQuadkey) return;

	const currentTile = quadkeyToTile(currentQuadkey);

	const [x, y, z] = currentTile;
	let newTile: [number, number, number] | null = null;

	switch (direction) {
		case 'up':
			newTile = [x, y - 1, z];
			break;
		case 'left':
			newTile = [x - 1, y, z];
			break;
		case 'down':
			newTile = [x, y + 1, z];
			break;
		case 'right':
			newTile = [x + 1, y, z];
			break;
	}

	if (newTile) {
		if (newTile[1] < 0) {
			newTile[1] = Math.pow(2, z) - 1;
		}
		if (newTile[1] >= Math.pow(2, z)) {
			newTile[1] = 0;
		}
		if (newTile[0] < 0) {
			newTile[0] = Math.pow(2, z) - 1;
		}

		return tileToQuadkey(newTile);
	}
}
export function changeQuadkey(direction: string) {
	/** Change the quadkey store in the direction of the arrow key
	 *
	 * @param {string} 'up' | 'left' | 'down' | 'right'
	 * */
	const qks = get(quadkeys);
	if (qks.length !== 1) return;
	const newQuadkey = handleArrowPress(qks[0], direction);
	if (newQuadkey) {
		quadkeys.set([newQuadkey]);
	}
}
