<script lang="ts">
	import { onMount } from 'svelte';

	import { CupertinoPane, type CupertinoSettings } from 'cupertino-pane';

	let myPane: CupertinoPane;
	let innerWidth = 0;

	onMount(() => {
			myPane = new CupertinoPane(
      ".cupertino-pane", // Pane container selector
      {
				buttonDestroy: false,
				bottomClose: false,
				lowerThanBottom: false,
				fastSwipeClose: false,
      } as CupertinoSettings
    );
	});


	function addCupertinoPane(width: number) {
		if (myPane === undefined) return;
		const presented = myPane.isPanePresented();
		if (width < 768 && !presented) {
			myPane.present({animate: true});
		} else if (width >= 768 && presented) {
			myPane.destroy();
		}
	}

	$: addCupertinoPane(innerWidth);

</script>

<svelte:window bind:innerWidth />
<div
	class="max-md:hidden absolute left-0 top-0 z-50 m-[3vh] overflow-x-hidden box-border max-h-[94vh] w-96 overflow-y-auto rounded-2xl border-transparent bg-white p-5 md:shadow-lg dark:bg-gray-800"
>
	<slot/>
</div>
<div class="cupertino-pane md:hidden p-5"><slot/></div>
