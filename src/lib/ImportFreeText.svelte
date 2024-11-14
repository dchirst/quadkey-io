<script lang="ts">
  import { inputGeojson, inputZoom } from '../stores';
  import { CircleX } from 'lucide-svelte';
  let freetext = '';
  let invalid = false;
  let errorClass = '';

  function handleImportFreeText() {
    try {
      const parsed = JSON.parse(freetext);
      if (parsed.type && parsed.type === 'FeatureCollection' || parsed.type === 'Feature') {
        $inputGeojson = parsed;
        invalid = false;
      } else {
        throw new Error('Invalid GeoJSON');
      }
    } catch {
      invalid = true;
    }
  }

  $: errorClass = invalid ? 'textarea-error' : '';

</script>

<div>
  <textarea bind:value={freetext} class="textarea textarea-bordered {errorClass} w-full" />
  {#if invalid}
    <div class="alert alert-error">
      <CircleX/>
      <p class="">Invalid GeoJSON</p>
    </div>
  {/if}
	<button on:click={handleImportFreeText} class="btn mt-3">Import </button>



</div>
