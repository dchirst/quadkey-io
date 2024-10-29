import { quadkeyToTile, tileToBBOX, tileToQuadkey } from '@mapbox/tilebelt';
import * as turf from '@turf/turf';
import type { Feature, FeatureCollection, BBox } from 'geojson';
import { area, bboxPolygon } from '@turf/turf';

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
function generateQuadkeysAndCenters(zoom: number): { quadkey: string; center: [number, number] }[] {
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
export function updateLines(map: maplibregl.Map, zoom: number) {
	const longitudes = getLongitudes(zoom);
	const latitudes = getLatitudes(zoom);

	const longitudeLines = longitudes.map((lng) =>
		turf.lineString([
			[lng, -90],
			[lng, 90]
		])
	);
	const latitudeLines = latitudes.map((lat) =>
		turf.lineString([
			[-180, lat],
			[180, lat]
		])
	);
	const geojson = turf.featureCollection([...longitudeLines, ...latitudeLines]);

	if (map.getSource('lines')) {
		const source = map.getSource('lines') as maplibregl.GeoJSONSource;
		source.setData(geojson);
	} else {
		map.addSource('lines', {
			type: 'geojson',
			data: geojson
		});

		map.addLayer({
			id: 'lines',
			type: 'line',
			source: 'lines',
			paint: {
				'line-color': '#000',
				'line-width': 2
			}
		});
	}
}

export function addQuadkeysToMap(map: maplibregl.Map, zoom: number) {
	const quadkeysAndCenters = generateQuadkeysAndCenters(zoom);
	const features: Feature[] = quadkeysAndCenters.map(({ quadkey, center }) => ({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: center
		},
		properties: {
			text: quadkey
		}
	}));

	const geojson: FeatureCollection = {
		type: 'FeatureCollection',
		features: features
	};

	if (map.getSource('quadkeys')) {
		const source = map.getSource('quadkeys') as maplibregl.GeoJSONSource;
		source.setData(geojson);
	} else {
		map.addSource('quadkeys', {
			type: 'geojson',
			data: geojson
		});

		map.addLayer({
			id: 'quadkeys',
			type: 'symbol',
			source: 'quadkeys',
			layout: {
				'text-field': ['get', 'text'],
				'text-size': 20,
				'text-offset': [0, 0]
			},
			paint: {
				'text-color': '#000'
			}
		});
	}
}

export function highlightQuadkey(
	map: maplibregl.Map,
	newQuadkey: string,
	tile: [number, number, number],
	flyTo: boolean = false
) {
	if (!newQuadkey) {
		return;
	}
	const bbox = tileToBBOX(tile);
	const polygon = turf.bboxPolygon(bbox);

	if (map.getSource('highlight')) {
		const source = map.getSource('highlight') as maplibregl.GeoJSONSource;
		source.setData(polygon);
	} else {
		map.addSource('highlight', {
			type: 'geojson',
			data: polygon
		});

		map.addLayer({
			id: 'highlight',
			type: 'fill',
			source: 'highlight',
			paint: {
				'fill-color': '#ff0000',
				'fill-opacity': 0.5
			}
		});
	}

	if (flyTo) {
		map.flyTo({
			center: [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2],
			zoom: tile[2] + 1
		});
	}
	return newQuadkey;
}

export function quadkeyToBBOX(qk: string): BBox {
	const tile = quadkeyToTile(qk);
	return tileToBBOX(tile).map((coord) => parseFloat(coord.toFixed(3))) as BBox;
}

export function quadkeyToAreaInHectares(qk: string): string {
	const bbox = quadkeyToBBOX(qk);
	const polygon = bboxPolygon(bbox);
	const areaHa: number = area(polygon) / 10000;
	return areaHa.toFixed(3); // Convert square meters to hectares
}

export function saveAsGeoJSON(quadkey: string) {
	const bbox = quadkeyToBBOX(quadkey);
	const polygon = bboxPolygon(bbox);
	const geojson = JSON.stringify(polygon);
	const blob = new Blob([geojson], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${quadkey}.geojson`;
	a.click();
	URL.revokeObjectURL(url);
}
