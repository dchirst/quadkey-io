<script lang="ts">
	import { Check } from 'lucide-svelte';

	export let textToCopy: string;
	export let tooltipText: string;
	let copied = false;

	function handleCopy() {
		/** Copy the text to the clipboard */
		navigator.clipboard.writeText(textToCopy);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<div class="tooltip" data-tip={tooltipText}>
	<button class="btn btn-square btn-sm" on:click={handleCopy}>
		<span id="default-message" class={copied ? 'hidden' : ''}>
			<slot />
		</span>
		<span id="success-message" class="{copied ? '' : 'hidden'} inline-flex items-center">
			<Check />
		</span>
	</button>
</div>
