import { pointToTile, quadkeyToTile, tileToBBOX, tileToQuadkey } from '@mapbox/tilebelt';
import type { BBox } from 'geojson';
import { area } from '@turf/turf';
import * as turf from '@turf/turf';
import type { LngLatBounds } from 'maplibre-gl';

// TODO: add docstrings

export function getTileBounds(bounds: LngLatBounds, zoom: number): [number, number, number, number] {
	/** Convert the lat/lng bounds to tile bounds at a given zoom level
	 *
	 * @param {LngLatBounds} bounds - bounds of the map
	 * @param {number} zoom - zoom level
	 * @returns {number[]} - minimum tile on x-axis, minimum tile on y-axis, maximum tile on x-axis, maximum tile on y-axis
	 */
	const [minX, minY] = pointToTile(bounds.getWest(), bounds.getNorth(), zoom);
	const [maxX, maxY] = pointToTile(bounds.getEast(), bounds.getSouth(), zoom);
	return [minX, minY, maxX, maxY];
}

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

function getTileValues(zoom: number, minValue: number, maxValue: number) {
	/** Get a list of tile values between a min and max value by wrapping around the max value for a given zoom level.
	 *
	 * @param {number} zoom - zoom level
	 * @param {number} minValue - minimum value
	 */
	// Get the maximum value a tile can be at a given zoom level
	const maxTile = Math.pow(2, zoom);

	// Iterate through, wrapping around the max value
	const result: number[] = [];
	for (let i = minValue; ; i++) {
		if (i > maxTile) {
			i = 0;
		}
		result.push(i);
		if (i === maxValue) {
			break;
		}
	}
	return result;
}

export function quadkeyLongitudes(zoom: number, minx: number, maxx: number): number[] {
	/** Get the longitudes for all tiles at a given zoom level
	 *
	 * @param {number} zoom - zoom level
	 * @returns {number[]} - longitudes
	 */

	const tileValues = getTileValues(zoom, minx, maxx);

	return tileValues.map((x) => tile2lon(x, zoom));
}

export function quadkeyLatitudes(zoom: number, miny: number, maxy: number): number[] {
	/** Get the latitudes for all tiles at a given zoom level
	 *
	 * @param {number} zoom - zoom level
	 * @returns {number[]} - latitudes
	 */
	const tileValues = getTileValues(zoom, miny, maxy);

	return tileValues.map((y) => tile2lat(y, zoom));
}

export function generateQuadkeysAndCenters(
	bounds: LngLatBounds,
	zoom: number
): { quadkey: string; center: [number, number] }[] {
	/** Generate quadkeys and centers for all tiles at a given zoom level
	 *
	 * @param {number} zoom - zoom level
	 * @returns {Object[]}
	 * */
	const [minx, miny, maxx, maxy] = getTileBounds(bounds, zoom);

	const xTiles = getTileValues(zoom, minx, maxx);
	const yTiles = getTileValues(zoom, miny, maxy);

	return xTiles.flatMap((x) =>
		yTiles.map((y) => {
			const quadkey = tileToQuadkey([x, y, zoom]);
			const bbox = tileToBBOX([x, y, zoom]);
			const center: [number, number] = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
			return { quadkey, center };
		})
	);
}

export function quadkeysStatistics(quadkeys: string[]) {
	/** Get the bounding box and area for a list of quadkeys
	 *
	 * @param {string[]}
	 * @returns {Object}
	 * */
	const geojson = quadkeysToGeojson(quadkeys);

	const bbox = turf.bbox(geojson).map((coord) => parseFloat(coord.toFixed(3))) as BBox;
	const areaHa = area(geojson) / 10000;

	return {
		bbox: bbox,
		areaHa: areaHa.toFixed(3)
	};
}

export function quadkeysToGeojson(quadkeys: string[]) {
	/** Convert a list of quadkeys to a GeoJSON FeatureCollection
	 *
	 * @param {string[]} quadkeys
	 * @returns {FeatureCollection}
	 * */
	const features = quadkeys.map((qk) => {
		const feat = turf.bboxPolygon(quadkeyToBBOX(qk));
		feat.properties = { quadkeyId: qk };
		return feat;
	});

	const fc = turf.featureCollection(features);

	return fc;
}

export function quadkeyToBBOX(quadkey: string): BBox {
	/** Get the bounding box for a quadkey
	 *
	 * @param {string} quadkey
	 * @returns {BBox}
	 * */
	const tile = quadkeyToTile(quadkey);
	return tileToBBOX(tile);
}

export function saveAsGeoJSON(quadkeys: string[]) {
	/** Save a list of quadkeys as a GeoJSON file
	 *
	 * @param {string[]} quadkeys
	 * */
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

export function handleQuadkeyText(quadkeyText: string) {
	/** Parse a string of quadkeys separated by commas
	 *
	 * @param {string} quadkeyText
	 * @returns {string[]} - list of quadkeys
	 * */
	if (!quadkeyText) return [];

	const qks = quadkeyText.split(',');

	const quadkeys = qks.map((qk) => qk.trim());
	const filteredQuadkeys = quadkeys.filter((qk) => /^[0-3]{1,16}$/.test(qk));
	if (filteredQuadkeys.length !== quadkeys.length) {
		console.log('Invalid quadkeys');
	}

	return filteredQuadkeys;
}

export function copyToClipboard(text: string) {
	/** Copy text to clipboard
	 *
	 * @param {string} text
	 * */
	navigator.clipboard.writeText(text).then(() => {
		alert('Copied to clipboard');
	});
}
