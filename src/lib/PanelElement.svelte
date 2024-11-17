<script lang="ts">
	import { onMount } from 'svelte';

	import { CupertinoPane, type CupertinoSettings } from 'cupertino-pane';

	let myPane: CupertinoPane;
	let innerWidth = 0;

	onMount(() => {
		myPane = new CupertinoPane(
			'.cupertino-pane', // Pane container selector
			{
				buttonDestroy: false,
				bottomClose: false,
				lowerThanBottom: false,
				fastSwipeClose: true
			} as CupertinoSettings
		);
	});

	function addCupertinoPane(width: number) {
		/** Add or remove the CupertinoPane based on the width of the screen
		 *
		 * @param {number} width - The width of the screen
		 * */
		if (!myPane) return;
		const presented = myPane.isPanePresented();
		if (width < 768 && !presented) {
			myPane.present({ animate: true });
		} else if (width >= 768 && presented) {
			myPane.destroy();
		}
	}

	$: addCupertinoPane(innerWidth);
</script>

<svelte:window bind:innerWidth />
<div
	class="absolute left-0 top-0 z-50 m-[3vh] box-border max-h-[94vh] w-96 overflow-y-auto overflow-x-hidden rounded-2xl border-transparent bg-white p-5 max-md:hidden md:shadow-lg dark:bg-gray-800"
>
	<slot />
</div>
<div class="cupertino-pane p-5 md:hidden"><slot /></div>

<style>
	:global(.cupertino-pane-wrapper .pane) {
		@apply bg-white;
		@apply dark:bg-gray-800;
		@apply dark:text-white;
	}
</style>
