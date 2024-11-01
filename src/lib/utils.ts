import { quadkeyToTile, tileToBBOX, tileToQuadkey } from '@mapbox/tilebelt';
import type { BBox } from 'geojson';
import { area} from '@turf/turf';
import * as turf from '@turf/turf';

// TODO: add docstrings
// TODO: add text for highlighted quadkey

export function tile2lon(x: number, z: number): number {
	/** Converts x tile coordinate to longitude
	 * @param {number} x - x tile coordinate
	 * @param {number} z - zoom level
	 * @returns {number} - longitude
	 * */
	return (x / Math.pow(2, z)) * 360 - 180;
}

export function tile2lat(y: number, z: number): number {
	/** Converts y tile coordinate to latitude
	 * @param {number} y - y tile coordinate
	 * @param {number} z - zoom level
	 * @returns {number} - latitude
	 * */
	const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
	return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

export function getLongitudes(zoom: number): number[] {
	/** Get the longitudes for all tiles at a given zoom level
	 *
	 * @param {number} zoom - zoom level
	 * @returns {number[]} - longitudes
	 */
	const numTiles = Math.pow(2, zoom);
	const longitudes: number[] = [];

	for (let x = 0; x < numTiles; x++) {
		longitudes.push(tile2lon(x, zoom));
	}

	return longitudes;
}

export function getLatitudes(zoom: number): number[] {
	const numTiles = Math.pow(2, zoom);
	const latitudes: number[] = [];

	for (let y = 0; y < numTiles; y++) {
		latitudes.push(tile2lat(y, zoom));
	}

	return latitudes;
}

export function generateQuadkeysAndCenters(
	zoom: number
): { quadkey: string; center: [number, number] }[] {
	const numTiles = Math.pow(2, zoom);
	const results: { quadkey: string; center: [number, number] }[] = [];

	for (let x = 0; x < numTiles; x++) {
		for (let y = 0; y < numTiles; y++) {
			const quadkey = tileToQuadkey([x, y, zoom]);
			const bbox = tileToBBOX([x, y, zoom]);
			const center: [number, number] = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
			results.push({ quadkey, center });
		}
	}

	return results;
}

export function quadkeysStatistics(quadkeys: string[]) {
	const geojson = quadkeysToGeojson(quadkeys);

	const bbox = turf.bbox(geojson).map((coord) => parseFloat(coord.toFixed(3))) as BBox;
	const areaHa = area(geojson) / 10000;

	return {
		bbox: bbox,
		areaHa: areaHa.toFixed(3)
	};
}

export function quadkeysToGeojson(quadkeys: string[]) {
	const polygons = quadkeys.map((qk) => turf.bboxPolygon(quadkeyToBBOX(qk)));

	const fc = turf.featureCollection(polygons);

	return fc;
}

export function quadkeyToBBOX(quadkey: string): BBox {
	const tile = quadkeyToTile(quadkey);
	return tileToBBOX(tile);
}

export function saveAsGeoJSON(quadkeys: string[]) {
	const geojson = JSON.stringify(quadkeysToGeojson(quadkeys));
	const blob = new Blob([geojson], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `quadkeys.geojson`;
	a.click();
	URL.revokeObjectURL(url);
}

export function handleArrowPress(currentQuadkey: string, direction: string) {
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

export function handleQuadkeyText(quadkeyText: string) {
	if (!quadkeyText) return [];

	const qks = quadkeyText.split(',');

	const quadkeys = qks.map((qk) => qk.trim());
	const filteredQuadkeys = quadkeys.filter((qk) => /^[0-3]{1,16}$/.test(qk));
	if (filteredQuadkeys.length !== quadkeys.length) {
		console.log('Invalid quadkeys');
	}

	return filteredQuadkeys;
}
