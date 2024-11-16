<script lang="ts">
	import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
	import Import from '$lib/Import.svelte';
	import ControlPanel from '$lib/ControlPanel.svelte';
	import Intro from '$lib/Intro.svelte';
</script>

<div
	class="absolute left-0 top-0 z-50 m-[3vh] box-border max-h-[94vh] w-96 overflow-y-auto rounded-2xl border-transparent bg-white p-5 shadow-lg dark:bg-gray-800"
>
	<Intro />
	<div class="divider"></div>
	<QuadkeyInfo />
	<div class="divider"></div>
	<ControlPanel />
	<div class="divider"></div>
	<!-- You can open the modal using ID.showModal() method -->
	<Import />
</div>
