<script lang="ts">
	import { onMount } from 'svelte';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { tileToQuadkey, pointToTile } from '@mapbox/tilebelt';
	import Panel from '$lib/Panel.svelte';
	import { quadkeys, multiSelect, inputGeojson, inputZoom } from '../stores';
	import {
		addQuadkeysToMap,
		getQuadkeysInPolygon,
		highlightQuadkeys,
		loadInputGeojson,
		updateLines
	} from '$lib/mapUtils';
	import type { FeatureCollection } from 'geojson';

	let map: maplibregl.Map;
	let mapContainer: HTMLDivElement;
	let zoom: number;
	let dark;

	// When the list of quadkeys changes, highlight them on the map

	function handleInput(geojson: FeatureCollection | null, zoom: number) {
		if (geojson) {
			loadInputGeojson(map, geojson);
			const newQuadkeys = getQuadkeysInPolygon(geojson, zoom);
			$quadkeys = newQuadkeys;
			highlightQuadkeys(map, newQuadkeys, false);
		}
	}

	$: handleInput($inputGeojson, $inputZoom);

	$: highlightQuadkeys(map, $quadkeys, true);

	onMount(() => {
		const initialState = { lng: 0, lat: 0, zoom: $inputZoom };

		zoom = initialState.zoom;

		if (
			localStorage.theme === 'dark' ||
			(!('color-theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			dark = true;
		} else {
			dark = false;
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			dark = event.matches;
		});

		map = new maplibregl.Map({
			container: mapContainer,
			style: `https://tiles.openfreemap.org/styles/positron`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		map.on('load', () => {
			// Add quadkeys to the map
			updateLines(map, initialState.zoom);
			addQuadkeysToMap(map, initialState.zoom);
		});

		map.on('zoomend', () => {
			// When zoom changes, update the lines and add new quadkeys
			zoom = Math.ceil(map.getZoom());
			addQuadkeysToMap(map, zoom);
			updateLines(map, zoom);
		});

		map.on('moveend', () => {
			// When zoom changes, update the lines and add new quadkeys
			zoom = Math.ceil(map.getZoom());
			addQuadkeysToMap(map, zoom);
			updateLines(map, zoom);
		});

		map.on('click', (e) => {
			// When a user clicks on the map, get the quadkey of the clicked tile
			const { lng, lat } = e.lngLat;
			console.log(lng, lat);
			const clickedQuadkey = tileToQuadkey(pointToTile(lng, lat, zoom));
			console.log('clickedQuadkey', clickedQuadkey);
			if ($multiSelect) {
				$quadkeys = [...$quadkeys, clickedQuadkey];
			} else {
				console.log('clickedQuadkey', clickedQuadkey);
				$quadkeys = [clickedQuadkey];
			}
		});
	});
</script>

<Panel />
<div class="relative w-full" style="height: 100vh">
	<div class="absolute h-full w-full {dark ? 'mapDark' : ''}" bind:this={mapContainer}></div>
</div>

<style>
	.mapDark {
		filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
	}
</style>
