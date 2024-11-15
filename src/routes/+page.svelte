<script lang="ts">
	import { onMount } from 'svelte';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { tileToQuadkey, pointToTile } from '@mapbox/tilebelt';
	import Panel from '$lib/Panel.svelte';
	import { quadkeys, multiSelect } from '../stores';
	import { addQuadkeysToMap, highlightQuadkeys, updateLines } from '$lib/mapUtils';

	let map: maplibregl.Map;
	let mapContainer: HTMLDivElement;
	let zoom: number;

	// When the list of quadkeys changes, highlight them on the map
	$: highlightQuadkeys(map, $quadkeys, true);

	onMount(() => {
		const initialState = { lng: 0, lat: 0, zoom: 3 };

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

			const clickedQuadkey = tileToQuadkey(pointToTile(lng, lat, zoom));
			if ($multiSelect) {
				$quadkeys = [...$quadkeys, clickedQuadkey];
			} else {
				$quadkeys = [clickedQuadkey];
			}
		});
	});
</script>

<Panel />
<div class="relative w-full" style="height: 100vh">
	<div class="absolute h-full w-full" bind:this={mapContainer}></div>
</div>
