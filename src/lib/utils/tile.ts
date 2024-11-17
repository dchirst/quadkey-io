import type { LngLatBounds } from 'maplibre-gl';
import { pointToTile } from '@mapbox/tilebelt';

export function getTileBounds(
	bounds: LngLatBounds,
	zoom: number
): [number, number, number, number] {
	/** Convert the lng/lat bounds to tile bounds at a given zoom level
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

export function tileRange(zoom: number, minValue: number, maxValue: number) {
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
