<script>
	import Panel from '$lib/Panel.svelte';
	import Map from '$lib/Map.svelte';
	import KeyboardHandler from '$lib/KeyboardHandler.svelte';
</script>

<svelte:head>
	<title>Quadkey Navigator</title>
	<meta name="description" content="A tool to visualise quadkeys." />
</svelte:head>

<KeyboardHandler />
<Panel />
<Map />
