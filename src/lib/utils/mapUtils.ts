import * as turf from '@turf/turf';
import type { Feature, FeatureCollection } from 'geojson';
import { pointToTile, tileToQuadkey, tileToBBOX } from '@mapbox/tilebelt';
import { getTileBounds } from './tile';
import {
	generateQuadkeysAndCenters,
	latitudeLines,
	longitudeLines,
	quadkeysToGeojson
} from '$lib/utils/quadkey';

export function updateQuadkeyLines(map: maplibregl.Map, zoom: number) {
	/** Update the lines that delineate quadkeys on a map
	 *
	 * @param {maplibregl.Map} map - map object
	 * @param {number} zoom - zoom level
	 */
	const [minx, miny, maxx, maxy] = getTileBounds(map.getBounds(), zoom);

	const longitudes = longitudeLines(zoom, minx, maxx);
	const latitudes = latitudeLines(zoom, miny, maxy);

	const lonLines = longitudes.map((lng) =>
		turf.lineString([
			[lng, -90],
			[lng, 90]
		])
	);
	const latLines = latitudes.map((lat) =>
		turf.lineString([
			[-180, lat],
			[180, lat]
		])
	);
	const geojson = turf.featureCollection([...lonLines, ...latLines]);

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

export function addQuadkeyNamesToMap(map: maplibregl.Map, zoom: number) {
	/** Add quadkey text to the map
	 *
	 * @param {maplibregl.Map} map - map object
	 * @param {number}
	 * */
	const quadkeysAndCenters = generateQuadkeysAndCenters(map.getBounds(), zoom);
	const features: Feature[] = quadkeysAndCenters.map(({ quadkey, center }) => ({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: center
		},
		properties: {
			quadkeyId: quadkey
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
				'text-field': ['get', 'quadkeyId'],
				'text-size': 30,
				'text-offset': [0, 0],
				'text-font': ['Noto Sans Regular']
			},
			paint: {
				'text-color': '#000',
				'text-halo-color': '#fff',
				'text-halo-width': 2
			}
		});
	}
}

export function highlightQuadkeys(
	map: maplibregl.Map,
	newQuadkeys: string[],
	flyTo: boolean = false
) {
	/** Highlight the selected quadkeys on the map
	 *
	 * @param {maplibregl.Map} map - map object
	 * @param {string[]} newQuadkeys - list of quadkeys to highlight
	 * @param {boolean} flyTo - whether to fly to the highlighted quadkeys
	 * @returns {string[]} - list of highlighted quadkeys if there are any
	 */
	newQuadkeys = newQuadkeys.filter((qk) => /^[0-3]{1,16}$/.test(qk) && qk !== '');
	if (!newQuadkeys || newQuadkeys.length === 0 || map === undefined) {
		if (map !== undefined && map.getLayer('highlight')) {
			map.removeLayer('highlight');
			map.removeLayer('highlightedQuadkeyText');
		}
		return;
	}

	const fc = quadkeysToGeojson(newQuadkeys);

	if (map.getSource('highlight')) {
		const source = map.getSource('highlight') as maplibregl.GeoJSONSource;

		source.setData(fc);
	} else {
		map.addSource('highlight', {
			type: 'geojson',
			data: fc
		});
	}
	if (!map.getLayer('highlight') && !map.getLayer('highlightedQuadkeyText')) {
		map.addLayer({
			id: 'highlight',
			type: 'fill',
			source: 'highlight',
			paint: {
				'fill-color': '#ff0000',
				'fill-opacity': 0.5,
				'fill-outline-color': '#FFF'
			}
		});
		map.addLayer({
			id: 'highlightedQuadkeyText',
			type: 'symbol',
			source: 'highlight',
			layout: {
				'text-field': ['get', 'quadkeyId'],
				'text-size': 40,
				'text-offset': [0, 0],
				'text-font': ['Noto Sans Regular']
			},
			paint: {
				'text-color': '#000',
				'text-halo-color': '#fff',
				'text-halo-width': 2
			}
		});
	}

	const extent = turf.bbox(fc);
	if (flyTo) {
		map.fitBounds(extent as [number, number, number, number], { padding: 300 });
	}
	return newQuadkeys;
}

export function loadInputGeojson(map: maplibregl.Map, geojson: FeatureCollection | null) {
	/** Load a GeoJSON object onto the map
	 *
	 * @param {maplibregl.Map} map - map object
	 * @param {FeatureCollection} geojson - GeoJSON object
	 */
	if (!(geojson && map)) return;
	if (map.getSource('inputGeojson')) {
		const source = map.getSource('inputGeojson') as maplibregl.GeoJSONSource;
		source.setData(geojson);
	} else {
		map.addSource('inputGeojson', {
			type: 'geojson',
			data: geojson
		});

		map.addLayer({
			id: 'inputGeojson',
			type: 'fill',
			source: 'inputGeojson',
			paint: {
				'fill-color': '#0000ff',
				'fill-opacity': 0.5,
				'fill-outline-color': '#000'
			}
		});
	}

	map.fitBounds(turf.bbox(geojson) as [number, number, number, number], { padding: 20 });
}

export function getQuadkeysInPolygon(geojson: FeatureCollection | null, zoom: number): string[] {
	/** Get a list of quadkeys that intersect with a polygon
	 *
	 * @param {FeatureCollection} geojson - GeoJSON object
	 * @param {number} zoom - zoom level
	 * @returns {string[]} - list of quadkeys that overlap with the polygon
	 */
	if (!geojson) return [];
	const bbox = turf.bbox(geojson);
	const [minLng, minLat, maxLng, maxLat] = bbox;

	const minTile = pointToTile(minLng, maxLat, zoom);
	const maxTile = pointToTile(maxLng, minLat, zoom);

	const quadkeys: string[] = [];

	for (let x = minTile[0]; x <= maxTile[0]; x++) {
		for (let y = minTile[1]; y <= maxTile[1]; y++) {
			const tilePolygon = turf.bboxPolygon(tileToBBOX([x, y, zoom]));
			if (turf.booleanIntersects(geojson?.features[0], tilePolygon)) {
				quadkeys.push(tileToQuadkey([x, y, zoom]));
			}
		}
	}

	return quadkeys;
}
