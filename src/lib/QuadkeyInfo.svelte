<script lang="ts">
	import { quadkeys } from '../stores';
	import {
		copyToClipboard,
		handleQuadkeyText,
		quadkeysStatistics,
		saveAsGeoJSON
	} from '$lib/utils';

	let quadkeyText = '';

	$: stats = quadkeysStatistics($quadkeys);

	$: $quadkeys = handleQuadkeyText(quadkeyText);
</script>

<div class="z-50 mx-auto w-full max-w-md rounded-2xl bg-red-100 p-6 shadow-lg">
	<div class="mb-4 flex items-center space-x-2">
		<label for="quadkey-input" class="block text-left font-semibold text-gray-700">Quadkey:</label>
		<input
			id="quadkey-input"
			type="text"
			bind:value={quadkeyText}
			class="w-1/2 rounded border border-gray-300 p-2 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
			placeholder="000000"
		/>
		<button
			on:click={() => copyToClipboard($quadkeys.join(', '))}
			class="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
		>
			<i class="fas fa-copy"></i>
		</button>
	</div>
	{#if $quadkeys.length > 0}
		<p class="mb-2 text-left text-gray-600">
			BBox: <span class="rounded bg-yellow-100 p-1 font-mono">{stats['bbox']}</span>
			<button
				on:click={() => copyToClipboard(stats['bbox'].toString())}
				class="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
			>
				<i class="fas fa-copy"></i>
			</button>
		</p>
		<p class="mb-4 text-left text-gray-600">
			Area: <span class="rounded bg-yellow-100 p-1 font-mono">{stats['areaHa']}</span> ha
			<button
				on:click={() => copyToClipboard(stats['areaHa'])}
				class="ml-2 rounded bg-gray-200 p-1 hover:bg-gray-300"
			>
				<i class="fas fa-copy"></i>
			</button>
		</p>
		<button
			on:click={() => saveAsGeoJSON($quadkeys)}
			class="w-full rounded bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Save as GeoJSON
		</button>
	{/if}
</div>

<style>
	@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>
