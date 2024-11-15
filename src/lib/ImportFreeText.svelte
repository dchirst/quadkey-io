<script lang="ts">
	import { inputGeojson } from '../stores';
	import { CircleX } from 'lucide-svelte';
	let freetext = '';
	let invalid = false;
	let errorClass = '';

	function handleImportFreeText() {
		try {
			const parsed = JSON.parse(freetext);
			if ((parsed.type && parsed.type === 'FeatureCollection') || parsed.type === 'Feature') {
				$inputGeojson = parsed;
				invalid = false;
			} else {
				throw new Error('Invalid GeoJSON');
			}
		} catch {
			invalid = true;
		}
	}

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
