<script lang="ts">
	import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
	import Import from '$lib/Import.svelte';
	import ControlPanel from '$lib/ControlPanel.svelte';
	import Intro from '$lib/Intro.svelte';

</script>

<div class="absolute left-4 top-4 z-50 w-96 rounded-2xl bg-white p-5 shadow-lg">
	<Intro/>
	<div class="divider"></div>
	<QuadkeyInfo />
	<div class="divider"></div>
	<ControlPanel />
	<div class="divider"></div>
<!-- You can open the modal using ID.showModal() method -->
<Import/>
</div>
