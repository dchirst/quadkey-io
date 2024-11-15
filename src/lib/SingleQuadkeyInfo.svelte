<script lang="ts">
	import { Scaling, Copy, Grid2X2, CircleMinus } from 'lucide-svelte';
	import { quadkeys } from '../stores';
	import { get } from 'svelte/store';
	import { quadkeyToBBOX } from '$lib/utils';
	import CopyButton from '$lib/CopyButton.svelte';
	import { area, bboxPolygon } from '@turf/turf';

	export let index: number;
	let quadkey = '';
	let bbox = '';

	// Update the quadkey in the store whenever the local quadkey changes

	function updateQuadkeyOnTextChange(quadkey: string, index: number) {
		if (!quadkey) return;
		$quadkeys[index] = quadkey;
	}

	function updateQuadkeyOnStoreChange(qkList: string[]) {
		quadkey = qkList[index];
	}

	function deleteQuadkey() {
		const currentQuadkeys = get(quadkeys);
		if (currentQuadkeys.length === 1) {
			$quadkeys = [];
			return;
		}
		currentQuadkeys.splice(index, 1);
		quadkeys.set(currentQuadkeys);
	}

	$: updateQuadkeyOnTextChange(quadkey, index);

	$: updateQuadkeyOnStoreChange($quadkeys);

	$: bbox = quadkeyToBBOX(quadkey)
		.map((coord) => coord.toFixed(5))
		.join(', ');
	$: areaHa = area(bboxPolygon(quadkeyToBBOX(quadkey))) / 10000;
</script>

<div class="mb-4 flex items-center space-x-2">
	<label for="quadkey-input" class="block text-left font-semibold text-gray-700">{index}</label>
	<input
		id="quadkey-input"
		type="text"
		class="input input-bordered w-full max-w-xs"
		placeholder="000000"
		bind:value={quadkey}
	/>
	<CopyButton textToCopy={quadkey} tooltipText="Copy Quadkey"><Copy /></CopyButton>
	<CopyButton textToCopy={areaHa} tooltipText="Copy quadkey area: {areaHa.toLocaleString()} ha"
		><Scaling /></CopyButton
	>
	<CopyButton textToCopy={bbox} tooltipText="Copy bbox: {bbox}"><Grid2X2 /></CopyButton>

	<div class="tooltip" data-tip="Delete Quadkey">
		<button on:click={deleteQuadkey} class="btn btn-square btn-error btn-sm"
			><CircleMinus class="text-white" /></button
		>
	</div>
</div>
