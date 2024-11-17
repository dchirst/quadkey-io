import type { BBox, Feature, FeatureCollection } from 'geojson';
import { bboxPolygon } from '@turf/turf';


export function inputToGeojson(input: string): FeatureCollection | null {
	/** Convert the input string to a GeoJSON object
	 *
	 * @param {string} input - input string
	 * @returns {FeatureCollection | null} - GeoJSON object
	 * */

	const bbox = textToBBox(input);
	if (bbox) {
		return bboxToGeojson(bbox);
	}

	try {
		const geojson = JSON.parse(input);
		if (geojson.type == 'Feature') {
			const feature = geojson as Feature;
			return {
				type: 'FeatureCollection',
				features: [feature]
			} as FeatureCollection;
		} else if (geojson.type == 'FeatureCollection') {
			return geojson as FeatureCollection;
		} else {
			return null;
		}
	} catch (e) {
		console.error(e);
		return null;
	}
}
export function pointToGeojson(lon: number, lat: number): FeatureCollection {
	return {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [lon, lat]
				},
				properties: {}
			}
		]
	};
}


function textToBBox(text: string): BBox | null {
	/** Convert a string to a BBox if possible
	 *
	 * @param {string} text - input string
	 * @returns {BBox | null}
	 * */
	const bbox = /[[(]?(-?\d+.\d+, ?-?\d+.\d+, ?-?\d+.\d+, ?-?\d+.\d+)[\])]?/.exec(text);
	if (bbox) {
		const [minX, minY, maxX, maxY] = bbox[1].split(',').map(parseFloat);
		return [minX, minY, maxX, maxY] as BBox;
	} else {
		return null;
	}
}


function bboxToGeojson(bbox: BBox): FeatureCollection {
	/** Convert a BBox to a GeoJSON object
	 *
	 * @param {BBox} bbox - BBox
	 * @returns {FeatureCollection} - GeoJSON object
	 */
	return {
		type: 'FeatureCollection',
		features: [
			bboxPolygon(bbox)
		]
	};
}