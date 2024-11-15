<script lang="ts">
	import { Scaling, Copy, Grid2X2, CircleMinus, Check } from 'lucide-svelte';
	import { quadkeys } from '../stores';
	import { get } from 'svelte/store';

	export let index: number;
	let quadkey = '';
	let copied = false;

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
		currentQuadkeys.splice(index, 1);
		quadkeys.set(currentQuadkeys);
	}

	$: updateQuadkeyOnTextChange(quadkey, index);

	$: updateQuadkeyOnStoreChange($quadkeys);

	function handleCopy() {
		navigator.clipboard.writeText(quadkey);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
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
	<button class="btn btn-square btn-sm" on:click={handleCopy}>
		<span id="default-message" class={copied ? 'hidden' : ''}><Copy /></span>
		<span id="success-message" class="{copied ? '' : 'hidden'} inline-flex items-center">
			<Check />
		</span>
	</button>
	<button class="btn btn-square btn-sm"><Scaling /></button>
	<button class="btn btn-square btn-sm"><Grid2X2 /></button>
	<button on:click={deleteQuadkey} class="btn btn-square btn-sm"><CircleMinus /></button>
</div>
