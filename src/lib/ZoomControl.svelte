<script lang="ts">
  import { inputZoom } from '../stores';
</script>

<div class="flex justify-center">
<label class="input input-bordered flex items-center gap-2">
  Zoom
  <input type="number" class="grow" placeholder="{$inputZoom}" bind:value={$inputZoom} />
</label>
</div>