<script lang="ts">
  import type { FeatureCollection, Feature } from 'geojson';
  import { showImportModal, inputGeojson, inputZoom } from '../stores';

  let files: FileList | null = null;
  let fileInput: HTMLInputElement;
  let errorMessage = '';

  function inputToGeojson(input: string): FeatureCollection | null {
    try {
      const geojson = JSON.parse(input);
      if (geojson.type == 'Feature') {
        const feature = geojson as Feature;
        return {
          type: 'FeatureCollection',
          features: [feature]
        } as FeatureCollection;
      } else if (geojson.type == 'FeatureCollection') {
        return geojson as FeatureCollection;
      } else {
        errorMessage = 'Invalid GeoJSON file. Please upload a valid GeoJSON file.';
        return null;
      }
    } catch (e) {
      errorMessage = 'Invalid GeoJSON file. Please upload a valid GeoJSON file.';
      return null;
    }
  }

  function handleFileChange(files: FileList | null) {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          $inputGeojson = inputToGeojson(event.target.result);
          $showImportModal = false;
        }
      };

      reader.readAsText(file);
    }
  }

  $: handleFileChange(files);
</script>

<div>
<h1>Import File</h1>
  <input bind:files bind:this={fileInput} type="file" accept="application/geo+json" class="file-input file-input-bordered w-full max-w-xs" />
  <input type="number" bind:value={$inputZoom} min="0" class="number-input" />
  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}
  {#if inputGeojson}
    <p>GeoJSON file loaded successfully.</p>
  {/if}
</div>