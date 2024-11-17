<script>
	import ImportFile from '$lib/ImportFile.svelte';
	import ImportPoint from '$lib/ImportPoint.svelte';
	import ImportFreeText from '$lib/ImportFreeText.svelte';
</script>

<div class="rounded-2xl">
	<h2 class="text-bold mb-2 text-lg">Import</h2>

	<div role="tablist" class="tabs tabs-lifted">
		<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="File" />

		<div role="tabpanel" class="tab-content p-3">
			<ImportFile />
		</div>

		<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Point" />
		<div role="tabpanel" class="tab-content p-3">
			<ImportPoint />
		</div>

		<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Freetext" />
		<div role="tabpanel" class="tab-content p-3">
			<ImportFreeText />
		</div>
		<span class="tab"></span>
	</div>
</div>
