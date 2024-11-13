<script lang="ts">
  import type { Feature, Point } from 'geojson';
  import { inputGeojson} from '../stores';


  let order = 'lonlat'; // 'latlon' or 'lonlat'
  let errorMessage = '';
  let inputPoint: Feature<Point> | null = null;
	let coords: string = '';

	function textToFeature(coords: string): Feature<Point> | null{
		const [p1, p2] = coords.split(',').map(parseFloat);

		if (isNaN(p1) || isNaN(p2)) {
			errorMessage = 'Invalid coordinates. Please enter two numbers separated by a comma.';
			return null;
		}

		 const [lon, lat] = order === 'latlon' ? [p2, p1] : [p1, p2];

		 return {
			 type: 'Feature',
			 geometry: {
				 type: 'Point',
				 coordinates: [lon, lat]
			 }
		 } as Feature<Point>;
	}

  $: $inputGeojson = {type: 'FeatureCollection', features: inputPoint ? [inputPoint] : []};



</script>
<div>
  <label>
		Coords:
    <input type="text" bind:value={coords}/>
  </label>

  <button >Switch Order</button>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
  {#if inputPoint}
    <p>GeoJSON Point: {JSON.stringify(inputPoint)}</p>
  {/if}
	<button on:click={() => {inputPoint = textToFeature(coords)}}>Import Point </button>
</div>

<style>
  .error {
    color: red;
  }
</style>