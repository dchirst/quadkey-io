<script lang="ts">
	import type { FeatureCollection, Feature } from 'geojson';
	import { showImportModal, inputGeojson, inputZoom } from '../stores';

	let files: FileList | null = null;
	let fileInput: HTMLInputElement;
	let errorMessage = '';
	let errorClass = '';

	function inputToGeojson(input: string): FeatureCollection | null {
		try {
			const geojson = JSON.parse(input);
			if (geojson.type == 'Feature') {
				const feature = geojson as Feature;
				return {
					type: 'FeatureCollection',
					features: [feature]
				} as FeatureCollection;
			} else if (geojson.type == 'FeatureCollection') {
				return geojson as FeatureCollection;
			} else {
				errorMessage = 'Invalid GeoJSON file. Please upload a valid GeoJSON file.';
				return null;
			}
		} catch (e) {
			console.log(e);
			errorMessage = 'Invalid GeoJSON file. Please upload a valid GeoJSON file.';
			return null;
		}
	}

	function handleFileChange() {
		if (files && files[0]) {
			const file = files[0];
			const reader = new FileReader();

			reader.onload = (event) => {
				if (event.target && typeof event.target.result === 'string') {
					$inputGeojson = inputToGeojson(event.target.result);
					$showImportModal = false;
				}
			};

			reader.readAsText(file);
		}
	}

	$: errorClass = errorMessage ? 'file-input-error' : '';

	$: handleFileChange(files);
</script>

<div>
	<input
		bind:files
		bind:this={fileInput}
		type="file"
		accept="application/geo+json"
		class="file-input {errorClass} file-input-bordered w-full max-w-xs"
	/>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}

	<button on:click={handleFileChange} class="btn mt-3">Import </button>
</div>
