import type { Feature, FeatureCollection } from 'geojson';

export function inputToGeojson(input: string): FeatureCollection | null {
	/** Convert the input string to a GeoJSON object
	 *
	 * @param {string} input - input string
	 * @returns {FeatureCollection | null} - GeoJSON object
	 * */
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
