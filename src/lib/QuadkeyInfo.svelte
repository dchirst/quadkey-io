<script lang="ts">
	import type { BBox } from 'geojson';
	import { quadkeyToAreaInHectares, quadkeyToBBOX, saveAsGeoJSON } from '$lib/utils';
	import { quadkey } from '../stores';

	let bbox: BBox;
	let areaInHectares: string;

	$: bbox = quadkeyToBBOX($quadkey);
	$: areaInHectares = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
		quadkeyToAreaInHectares($quadkey)
	);

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			alert('Copied to clipboard');
		});
	}
</script>

<div class="z-50 mx-auto w-full max-w-md rounded-2xl bg-red-100 p-6 shadow-lg">
	<div class="mb-4 flex items-center space-x-2">
		<label for="quadkey-input" class="block text-left font-semibold text-gray-700">Quadkey:</label>
		<input
			id="quadkey-input"
			type="text"
			bind:value={$quadkey}
			class="w-1/2 rounded border border-gray-300 p-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
			placeholder="000000"
		/>
		<button
			on:click={() => copyToClipboard($quadkey)}
			class="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
		>
			<i class="fas fa-copy"></i>
		</button>
	</div>
	{#if $quadkey}
		<p class="mb-2 text-left text-gray-600">
			BBox: <span class="rounded bg-yellow-100 p-1 font-mono">{bbox}</span>
			<button
				on:click={() => copyToClipboard(bbox.toString())}
				class="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
			>
				<i class="fas fa-copy"></i>
			</button>
		</p>
		<p class="mb-4 text-left text-gray-600">
			Area: <span class="rounded bg-yellow-100 p-1 font-mono">{areaInHectares}</span> ha
			<button
				on:click={() => copyToClipboard(areaInHectares)}
				class="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
			>
				<i class="fas fa-copy"></i>
			</button>
		</p>
		<button
			on:click={() => saveAsGeoJSON($quadkey)}
			class="w-full rounded bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Save as GeoJSON
		</button>
	{/if}
</div>

<style>
	@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>
