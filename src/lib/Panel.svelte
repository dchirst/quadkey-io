<script lang="ts">
	import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
	import Arrows from '$lib/Arrows.svelte';
	import Import from '$lib/Import.svelte';

</script>

<div class="absolute left-4 top-4 z-50 w-96 rounded-2xl bg-white p-3 shadow-lg">
	<h1 class="p-3 text-center text-3xl">Quadkeys.io</h1>
	<p class="text-left">A simple tool to understand quadkeys. Click a tile to find out more.</p>
	<Arrows />
	<QuadkeyInfo />
<!-- You can open the modal using ID.showModal() method -->
<Import/>
</div>
