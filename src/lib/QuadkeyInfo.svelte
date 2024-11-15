<script lang="ts">
	import {} from '$lib/utils';
	import SingleQuadkeyInfo from '$lib/SingleQuadkeyInfo.svelte';
	import { quadkeys } from '../stores';

	function addQuadkeyInfo() {
		$quadkeys = [...$quadkeys, ''];
	}
</script>

<div class="">
	<div class="rounded-2xl bg-primary p-3">
		<h2 class="mb-2 text-lg text-white">Quadkey List</h2>
		{#each Array.from({ length: $quadkeys.length }, (_, index) => index) as index}
			<SingleQuadkeyInfo {index} />

			{#if index !== $quadkeys.length - 1}
				<div class="divider"></div>
			{/if}
		{/each}
		<button on:click={addQuadkeyInfo} class="btn mx-auto w-full">Add</button>
	</div>
</div>
