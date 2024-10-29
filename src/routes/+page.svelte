<script lang="ts">
  import { onMount } from 'svelte';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import maplibregl from 'maplibre-gl';
  import { tileToQuadkey, pointToTile } from '@mapbox/tilebelt';
  import Panel from '$lib/Panel.svelte';
  import { addQuadkeysToMap, highlightQuadkey, updateLines } from '$lib/utils';

  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  let map: maplibregl.Map;
  let mapContainer: HTMLDivElement;
  let currentZoom = 0;
  let currentTile: [number, number, number] | null = null;
  let quadkey = '';


  function handleArrowPress(direction: string) {
    if (!currentTile) return;

    const [x, y, z] = currentTile;
    let newTile: [number, number, number] | null = null;

    switch (direction) {
      case 'up':
        newTile = [x, y - 1, z];
        break;
      case 'left':
        newTile = [x - 1, y, z];
        break;
      case 'down':
        newTile = [x, y + 1, z];
        break;
      case 'right':
        newTile = [x + 1, y, z];
        break;
    }

    if (newTile) {
      if (newTile[1] < 0) {
        newTile[1] = Math.pow(2, z) - 1;
      }
      if (newTile[1] >= Math.pow(2, z)) {
        newTile[1] = 0;
      }
      currentTile = newTile;
      const quadkey = tileToQuadkey(newTile);
      highlightQuadkey(map, quadkey, newTile);
    }
  }


  onMount(() => {
    const initialState = { lng: 0, lat: 0, zoom: 3 };

    map = new maplibregl.Map({
      container: mapContainer,
      style: `https://api.maptiler.com/maps/basic-v2-light/style.json?key=${apiKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    map.on('load', () => {
      updateLines(map, initialState.zoom);
      addQuadkeysToMap(map, initialState.zoom);
    });

    map.on('zoomend', () => {
      currentZoom = Math.floor(map.getZoom());
      addQuadkeysToMap(map, currentZoom);
      updateLines(map, currentZoom);
    });

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      currentTile = pointToTile(lng, lat, Math.floor(map.getZoom()));
      const newQuadkey = tileToQuadkey(currentTile);
      quadkey = highlightQuadkey(map, newQuadkey, currentTile);
    });
  });




</script>

<Panel quadkey={quadkey} onArrowPress={handleArrowPress}/>
<div class="map-wrap">
  <a href="https://www.maptiler.com" class="watermark"><img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" /></a>
  <div class="map" bind:this={mapContainer}></div>
</div>

<style>
  .map-wrap {
    position: relative;
    width: 100%;
    height: 100vh; /* Full viewport height */
  }

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .watermark {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 999;
  }
</style>