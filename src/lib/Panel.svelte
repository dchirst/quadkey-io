<script lang="ts">
  import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
  import Arrows from '$lib/Arrows.svelte';

	export let onArrowPress;
  export let quadkey = '';
  let counter = 0;

</script>

<div class="w-64 p-3 rounded-2xl bg-white shadow-lg absolute top-4 left-4 z-50">
  <h1 class="text-3xl text-center p-3">Quadkeys.io</h1>
  <p class="text-left">Lorem ipsum</p>
  <Arrows onArrowPress={onArrowPress} />
  <QuadkeyInfo quadkey={quadkey} />
  <p>Counter: {counter}</p>
</div>