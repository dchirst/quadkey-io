<script lang="ts">
	import SingleQuadkeyInfo from '$lib/SingleQuadkeyInfo.svelte';
	import { quadkeys } from '../stores';
	import CopyButton from '$lib/CopyButton.svelte';
	import { Link } from 'lucide-svelte';

	let link: string;

	function addQuadkeyInfo() {
		$quadkeys = [...$quadkeys, ''];
	}

	function getLink(linkQuadkeys: string[]): string {
		const url = new URL(window.location.href);
		if (linkQuadkeys) {
			url.searchParams.set('qk', linkQuadkeys.join(','));
		}
		return url.href;
	}

	$: link = getLink($quadkeys);
</script>

<div class="">
	<div class="rounded-2xl bg-primary p-3">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-lg text-white">Quadkey List</h2>
			<CopyButton textToCopy={link} tooltipText="Copy link to map with the active quadkeys"
				><Link /></CopyButton
			>
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
