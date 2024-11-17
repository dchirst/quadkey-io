<script lang="ts">
	import { onMount } from 'svelte';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { tileToQuadkey, pointToTile } from '@mapbox/tilebelt';
	import { quadkeys, multiSelect, inputGeojson, inputZoom } from '../stores';
	import {
		addQuadkeyNamesToMap,
		getQuadkeysInPolygon,
		highlightQuadkeys,
		loadInputGeojson,
		updateQuadkeyLines
	} from '$lib/utils/mapUtils';
	import type { FeatureCollection } from 'geojson';

	let map: maplibregl.Map;
	let mapContainer: HTMLDivElement;
	let dark: boolean;

	function handleInput(geojson: FeatureCollection | null, zoom: number) {
		/** Add quadkeys to the map when the input geojson changes
		 *
		 * @param {FeatureCollection | null} geojson - The input geojson
		 * @param {number} zoom - The current zoom level
		 * */
		if (!geojson) return;
		loadInputGeojson(map, geojson);
		$quadkeys = getQuadkeysInPolygon(geojson, zoom);
	}

	function loadQuadkeysFromParams() {
		/** Load quadkeys from the URL params */
		const urlParams = new URLSearchParams(window.location.search);

		if (urlParams.has('qk')) {
			const qk: string | null = urlParams.get('qk');
			if (qk) {
				$quadkeys = qk.split(',');
			}
		}
	}

	$: handleInput($inputGeojson, $inputZoom);

	$: highlightQuadkeys(map, $quadkeys, true);

	onMount(() => {
		// Check if the user prefers dark mode
		dark =
			localStorage.theme === 'dark' ||
			(!('color-theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches);
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			dark = event.matches;
		});

		map = new maplibregl.Map({
			container: mapContainer,
			style: `https://tiles.openfreemap.org/styles/positron`,
			zoom: $inputZoom
		});

		map.on('load', () => {
			// Add quadkeys to the map
			updateQuadkeyLines(map, $inputZoom);
			addQuadkeyNamesToMap(map, $inputZoom);
		});

		map.on('zoomend', () => {
			// When zoom changes, update the lines and add new quadkeys
			const zoom = Math.ceil(map.getZoom());
			updateQuadkeyLines(map, zoom);
			updateQuadkeyLines(map, zoom);
		});

		map.on('move', () => {
			// When zoom changes, update the lines and add new quadkeys
			const zoom = Math.ceil(map.getZoom());
			addQuadkeyNamesToMap(map, zoom);
			updateQuadkeyLines(map, zoom);
		});

		map.on('click', (e) => {
			// When a user clicks on the map, get the quadkey of the clicked tile
			const zoom = Math.ceil(map.getZoom());
			const { lng, lat } = e.lngLat;
			const clickedQuadkey = tileToQuadkey(pointToTile(lng, lat, zoom));
			$inputZoom = zoom;
			if ($multiSelect) {
				$quadkeys = [...$quadkeys, clickedQuadkey];
			} else {
				$quadkeys = [clickedQuadkey];
			}
		});

		map.on('style.load', () => {
			loadQuadkeysFromParams();
		});
	});
</script>

<div class="relative w-full" style="height: 100vh">
	<div class="absolute h-full w-full {dark ? 'mapDark' : ''}" bind:this={mapContainer}></div>
</div>

<style>
	.mapDark {
		filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
	}
</style>
