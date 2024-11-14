<script lang="ts">
  import {
  } from '$lib/utils';
  import SingleQuadkeyInfo from '$lib/SingleQuadkeyInfo.svelte';
  import { quadkeys } from '../stores';

  function addQuadkeyInfo() {
    $quadkeys = [...$quadkeys, ''];
  }
</script>

<div class="">

  <div class="rounded-2xl bg-primary p-3">
    <h2 class="text-white text-lg mb-2">Quadkey List</h2>
  {#each Array.from({ length: $quadkeys.length }, (_, index) => index) as index}
    <SingleQuadkeyInfo {index} />

    {#if index !== $quadkeys.length - 1}
      <div class="divider"></div>
    {/if}
  {/each}
  <button on:click={addQuadkeyInfo} class="w-full mx-auto btn">Add</button>
    </div>
</div>
