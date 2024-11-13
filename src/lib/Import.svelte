<script>
	import ImportFile from '$lib/ImportFile.svelte';
	import ImportPoint from '$lib/ImportPoint.svelte';
	import ImportFreeText from '$lib/ImportFreeText.svelte';
</script>

<div role="tablist" class="tabs tabs-bordered my-3 rounded-2xl bg-amber-200 shadow-2xl w-full">
  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="File" />
  <div role="tabpanel" class="tab-content p-10">
		<ImportFile/>
	</div>

  <input
    type="radio"
    name="my_tabs_1"
    role="tab"
    class="tab"
    aria-label="Point"
    checked="checked" />
  <div role="tabpanel" class="tab-content p-10"><ImportPoint/></div>

  <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Free text" />
  <div role="tabpanel" class="tab-content p-10"><ImportFreeText/></div>
</div>