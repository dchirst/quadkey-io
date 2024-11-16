<script lang="ts">
	import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
	import Import from '$lib/Import.svelte';
	import ControlPanel from '$lib/ControlPanel.svelte';
	import Intro from '$lib/Intro.svelte';
</script>

<div
	class="max-md:w-full absolute max-md:top-3/4 max-md:bottom-0 left-0 top-0 z-50 md:m-[3vh] overflow-x-hidden box-border md:max-h-[94vh] md:w-96 overflow-y-auto rounded-2xl border-transparent bg-white p-5 shadow-lg dark:bg-gray-800"
>
	<Intro  />
	<div class="divider"></div>
	<QuadkeyInfo />
	<div class="divider max-md:hidden"></div>
	<ControlPanel />
	<div class="divider max-md:hidden"></div>
	<!-- You can open the modal using ID.showModal() method -->
	<Import />
</div>
