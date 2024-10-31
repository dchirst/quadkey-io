<script lang="ts">
	import { onMount } from 'svelte';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { tileToQuadkey, pointToTile, quadkeyToTile } from '@mapbox/tilebelt';
	import Panel from '$lib/Panel.svelte';
	import { quadkey } from '../stores';
	import { addQuadkeysToMap, highlightQuadkey, updateLines } from '$lib/mapUtils';

	// TODO: fix github deployment using relative imports

	let map: maplibregl.Map;
	let mapContainer: HTMLDivElement;
	let currentZoom = 0;
	let currentTile: [number, number, number] | null = null;

	$: highlightQuadkey(map, $quadkey, quadkeyToTile($quadkey), true);

	onMount(() => {
		const initialState = { lng: 0, lat: 0, zoom: 3 };

		map = new maplibregl.Map({
			container: mapContainer,
			style: `https://tiles.openfreemap.org/styles/positron`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		map.on('load', () => {
			updateLines(map, initialState.zoom);
			addQuadkeysToMap(map, initialState.zoom);
		});

		map.on('zoomend', () => {
			currentZoom = Math.ceil(map.getZoom());
			addQuadkeysToMap(map, currentZoom);
			updateLines(map, currentZoom);
		});

		map.on('click', (e) => {
			const { lng, lat } = e.lngLat;
			const zoom = Math.ceil(map.getZoom());

			currentTile = pointToTile(lng, lat, zoom);
			$quadkey = tileToQuadkey(currentTile);
		});
	});
</script>

<Panel />
<div class="map-wrap">
	<div class="map" bind:this={mapContainer}></div>
</div>

<style>
	.map-wrap {
		position: relative;
		width: 100%;
		height: 100vh; /* Full viewport height */
	}

	.map {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
