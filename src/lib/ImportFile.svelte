<script lang="ts">
	import type { FeatureCollection, Feature } from 'geojson';
	import { showImportModal, inputGeojson } from '../stores';
	import { CircleX } from 'lucide-svelte';

	let files: FileList | null = null;
	let fileInput: HTMLInputElement;
	let invalid = false;
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
				invalid = true;
				return null;
			}
		} catch (e) {
			console.log(e);
			invalid = true;
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
			invalid = false;
		} else {
			invalid = true;
		}
	}
	$: errorClass = invalid ? 'file-input-error' : '';
</script>

<div>
	<p class="my-3">Load in a GeoJSON file to see the overlapping quadkeys.</p>
	<input
		bind:files
		bind:this={fileInput}
		type="file"
		accept="application/geo+json"
		class="file-input {errorClass} file-input-bordered my-2 w-full max-w-xs"
	/>
	{#if invalid}
		<div class="alert alert-error">
			<CircleX />
			<p class="">Please load a valid GeoJSON</p>
		</div>
	{/if}

	<button on:click={handleFileChange} class="btn mt-3">Import </button>
</div>
