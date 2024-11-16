<script lang="ts">
	import {} from '$lib/utils';
	import SingleQuadkeyInfo from '$lib/SingleQuadkeyInfo.svelte';
	import { quadkeys } from '../stores';
	import CopyButton from '$lib/CopyButton.svelte';
	import { Link } from 'lucide-svelte';
	import { get } from 'svelte/store';

	let link: string

	function addQuadkeyInfo() {
		$quadkeys = [...$quadkeys, ''];
	}

	function getLink(quadkeys: string[]): string {
		const url = new URL(window.location.href);
		if (quadkeys) {
			url.searchParams.set('qk', $quadkeys.join(','));
		}
		return url.href;
	}

	$: link = getLink($quadkeys);
</script>


<div class="">
	<div class="rounded-2xl bg-primary p-3">
  <div class="flex justify-between items-center mb-2">
   <h2 class="text-lg text-white">Quadkey List</h2>
   <CopyButton textToCopy="{link}" tooltipText="Copy link to map with the active quadkeys"><Link/></CopyButton>
  </div>
		{#each Array.from({ length: $quadkeys.length }, (_, index) => index) as index}
			<SingleQuadkeyInfo {index} />

			{#if index !== $quadkeys.length - 1}
				<div class="divider"></div>
			{/if}
		{/each}
		<button on:click={addQuadkeyInfo} class="btn mx-auto w-full">Add</button>
	</div>
</div>
