<script lang="ts">
  import { inputGeojson, inputZoom } from '../stores';
  let freetext = '';
  let invalid = false;

  function onImportFreeText() {
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
</script>

<div>
  <textarea bind:value={freetext} />
  <input type="number" bind:value={$inputZoom} min="0" class="number-input" />
  <button on:click={onImportFreeText}>Import Free Text</button>
  {#if invalid}
    <p class="error">Invalid GeoJSON</p>
  {/if}
</div>

<style>
  .error {
    color: red;
  }
</style>