import * as turf from '@turf/turf';
import type { Feature, FeatureCollection } from 'geojson';
import { pointToTile } from '@mapbox/tilebelt';
import {
	generateQuadkeysAndCenters, getTileBounds,
	quadkeyLatitudes,
	quadkeyLongitudes,
	quadkeysToGeojson
} from '$lib/utils';





export function updateLines(map: maplibregl.Map, zoom: number) {
	const [minx, miny, maxx, maxy] = getTileBounds(map.getBounds(), zoom);

	const longitudes = quadkeyLongitudes(zoom, minx , maxx);
	const latitudes = quadkeyLatitudes(zoom, miny, maxy);

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
	if (!newQuadkeys || newQuadkeys.length === 0 || map === undefined || !map.isStyleLoaded()) {
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

		map.addLayer({
			id: 'highlight',
			type: 'fill',
			source: 'highlight',
			paint: {
				'fill-color': '#ff0000',
				'fill-opacity': 0.5
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
	console.log('extent', extent);
	if (flyTo) {
		map.fitBounds(extent as [number, number, number, number], { padding: 300 });
	}
	return newQuadkeys;
}
