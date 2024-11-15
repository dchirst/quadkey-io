<script lang="ts">
	import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
	import Import from '$lib/Import.svelte';
	import ControlPanel from '$lib/ControlPanel.svelte';
	import Intro from '$lib/Intro.svelte';
</script>

<div class="absolute left-0 top-0 z-50 w-96 rounded-2xl m-[3vh] border-transparent bg-white p-5 max-h-[94vh] box-border overflow-auto shadow-lg">
	<Intro />
	<div class="divider"></div>
	<QuadkeyInfo />
	<div class="divider"></div>
	<ControlPanel />
	<div class="divider"></div>
	<!-- You can open the modal using ID.showModal() method -->
	<Import />
</div>
