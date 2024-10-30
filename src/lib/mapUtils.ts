import * as turf from '@turf/turf';
import type { Feature, FeatureCollection } from 'geojson';
import { tileToBBOX } from '@mapbox/tilebelt';
import { generateQuadkeysAndCenters, getLatitudes, getLongitudes } from '$lib/utils';

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
			zoom: tile[2] - 0.5
		});
	}
	return newQuadkey;
}

