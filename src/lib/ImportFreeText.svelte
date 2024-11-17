<script lang="ts">
	import { inputGeojson } from '../stores';
	import { CircleX } from 'lucide-svelte';
	import { inputToGeojson } from '$lib/utils/input.js';
	let freetext = '';
	let invalid = false;
	let errorClass = '';

	function handleImportFreeText() {
		/** Convert the input to GeoJSON */
		$inputGeojson = inputToGeojson(freetext);
		if (!$inputGeojson) {
			invalid = true;
		}
	}

	// Update the look of the textarea if it's invalid
	$: errorClass = invalid ? 'textarea-error' : '';
</script>

<div>
	<p class="my-3">Paste a valid GeoJSON to see the overlapping quadkeys.</p>
	<textarea bind:value={freetext} class="textarea textarea-bordered {errorClass} w-full" />
	{#if invalid}
		<div class="alert alert-error">
			<CircleX />
			<p class="">Invalid GeoJSON</p>
		</div>
	{/if}
	<button on:click={handleImportFreeText} class="btn mt-3">Import </button>
</div>
