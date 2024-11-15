<script lang="ts">
	import type { Feature, Point } from 'geojson';
	import { inputGeojson } from '../stores';
	import { CircleX } from 'lucide-svelte';

	let errorMessage = '';
	let inputPoint: Feature<Point> | null = null;

	let lon: string;
	let lat: string;

	function handleImportPoint() {
		if (lon === undefined || lat === undefined) {
			errorMessage = 'Please enter both longitude and latitude.';
			return;
		}

		const lonFloat = parseFloat(lon);
		const latFloat = parseFloat(lat);

		if (isNaN(lonFloat) || isNaN(latFloat)) {
			errorMessage = 'Invalid coordinates. Please enter two numbers separated by a comma.';
			return;
		}

		if (lonFloat < -180 || lonFloat > 180 || latFloat < -90 || latFloat > 90) {
			errorMessage =
				'Invalid coordinates. Longitude must be between -180 and 180, and latitude must be between -90 and 90.';
			return;
		}

		console.log(lonFloat, latFloat);

		errorMessage = '';

		$inputGeojson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [lonFloat, latFloat]
					},
					properties: {}
				}
			]
		};
	}
</script>

<div>
	<p class="my-3">Select a point to see the quadkey that encompasses it.</p>
	<label class="form-control flex w-full max-w-xs">
		<div class="label gap-1">
			<span class="label-text gap-0">Longitude</span>
		</div>
		<input
			bind:value={lon}
			type="text"
			placeholder="27.12234"
			class="input input-sm input-bordered w-full max-w-xs"
		/>
		<div class="label gap-0">
			<span class="label-text gap-0">Latitude</span>
		</div>
		<input
			type="text"
			bind:value={lat}
			placeholder="22.3343423"
			class="input input-sm input-bordered w-full max-w-xs"
		/>
	</label>
	{#if errorMessage}
		<div class="alert alert-error my-2">
			<CircleX />
			<p class="">{errorMessage}</p>
		</div>
	{/if}
	{#if inputPoint}
		<p>GeoJSON Point: {JSON.stringify(inputPoint)}</p>
	{/if}
	<button on:click={handleImportPoint} class="btn mt-3">Import </button>
</div>
