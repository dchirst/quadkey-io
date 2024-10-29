<script lang="ts">
	import { quadkeyToTile, tileToBBOX } from '@mapbox/tilebelt';
	import { area, bboxPolygon } from '@turf/turf';
	import type { BBox } from '@turf/turf';

	export let quadkey = '123';
	let bbox: BBox;
	let areaInHectares: number;

	function quadkeyToBBOX(qk: string): BBox {
		const tile = quadkeyToTile(qk);
		return tileToBBOX(tile);
	}

	function quadkeyToAreaInHectares(qk: string): number {
		const bbox = quadkeyToBBOX(qk);
		const polygon = bboxPolygon(bbox);
		const areaInSquareMeters = area(polygon);
		return areaInSquareMeters / 10000; // Convert square meters to hectares
	}

	function saveAsGeoJSON() {
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

	$: bbox = quadkeyToBBOX(quadkey);
	$: areaInHectares = quadkeyToAreaInHectares(quadkey);
</script>

{#if quadkey}
	<div class="z-50 w-full rounded-2xl bg-red-200 p-3">
		<p class="text-left">Quadkey: {quadkey}</p>
		<p class="text-left">BBox: {bbox}</p>
		<p class="text-left">Area: {areaInHectares} hectares</p>
		<button on:click={saveAsGeoJSON} class="mt-2 rounded bg-blue-500 p-2 text-white"
			>Save as GeoJSON</button
		>
	</div>
{/if}
