<script lang="ts">
	import { inputGeojson } from '../stores';
	import { CircleX } from 'lucide-svelte';
	import { inputToGeojson } from '$lib/utils/input';

	let files: FileList | null = null;
	let invalid = false;
	let errorClass = '';

	function handleFileChange() {
		/** Load the file and convert it to GeoJSON */
		if (files && files[0]) {
			const file = files[0];
			const reader = new FileReader();

			reader.onload = (event) => {
				if (event.target && typeof event.target.result === 'string') {
					$inputGeojson = inputToGeojson(event.target.result);
					if (!$inputGeojson) {
						invalid = true;
					}
				}
			};

			reader.readAsText(file);
			invalid = false;
		} else {
			invalid = true;
		}
	}

	// Update the look of the file input if it's invalid
	$: errorClass = invalid ? 'file-input-error' : '';
</script>

<div>
	<p class="my-3">Load in a GeoJSON file to see the overlapping quadkeys.</p>
	<input
		bind:files
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
