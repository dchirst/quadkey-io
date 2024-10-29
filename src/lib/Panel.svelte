<script lang="ts">
	import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
	import Arrows from '$lib/Arrows.svelte';

	export let onArrowPress;
	export let quadkey = '';
	let counter = 0;
</script>

<div class="absolute left-4 top-4 z-50 w-64 rounded-2xl bg-white p-3 shadow-lg">
	<h1 class="p-3 text-center text-3xl">Quadkeys.io</h1>
	<p class="text-left">Lorem ipsum</p>
	<Arrows {onArrowPress} />
	<QuadkeyInfo {quadkey} />
	<p>Counter: {counter}</p>
</div>
