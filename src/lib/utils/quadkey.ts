import type { LngLatBounds } from 'maplibre-gl';
import { quadkeyToTile, tileToBBOX, tileToQuadkey } from '@mapbox/tilebelt';
import * as turf from '@turf/turf';
import type { BBox } from 'geojson';
import { area } from '@turf/turf';
import { getTileBounds, tile2lat, tile2lon, tileRange } from '$lib/utils/tile';

export function longitudeLines(zoom: number, minx: number, maxx: number): number[] {
	/** Get the longitudes for all tiles at a given zoom level. This is used to draw longitude lines on the map.
	 *
	 * @param {number} zoom - zoom level
	 * @param {number} minx - minimum tile value to calculate from
	 * @param {number} maxx - maximum tile value to calculate to
	 * @returns {number[]} - longitudes
	 */

	const tileValues = tileRange(zoom, minx, maxx);

	return tileValues.map((x) => tile2lon(x, zoom));
}

export function latitudeLines(zoom: number, miny: number, maxy: number): number[] {
	/** Get the latitudes for all tiles at a given zoom level
	 *
	 * @param {number} zoom - zoom level
	 * @param {number} miny - minimum tile value to calculate from
	 * @param {number} maxy - maximum tile value to calculate to
	 * @returns {number[]} - latitudes
	 */
	const tileValues = tileRange(zoom, miny, maxy);

	return tileValues.map((y) => tile2lat(y, zoom));
}

export function generateQuadkeysAndCenters(
	bounds: LngLatBounds,
	zoom: number
): { quadkey: string; center: [number, number] }[] {
	/** Generate quadkeys names and their centers for all tiles at a given zoom level and within the given bounds.
	 *
	 * @param {LngLatBounds} bounds - bounds of the map
	 * @param {number} zoom - zoom level
	 * @returns {Object[]} A list of objects containing quadkey and center
	 * */
	const [minx, miny, maxx, maxy] = getTileBounds(bounds, zoom);

	const xTiles = tileRange(zoom, minx, maxx);
	const yTiles = tileRange(zoom, miny, maxy);

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
	/** Get the extent and area for a list of quadkeys
	 *
	 * @param {string[]}
	 * @returns {Object} - bbox and area in hectares
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
