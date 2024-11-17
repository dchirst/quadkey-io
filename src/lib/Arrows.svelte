<script lang="ts">
	import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-svelte';
	import { changeQuadkey } from '$lib/utils/arrow';
	import { quadkeys } from '../stores';

	let disabled: boolean;

	$: disabled = $quadkeys.length > 1;
</script>

<div class="arrows p-3">
	<div
		class="tooltip"
		data-tip={disabled
			? 'Quadkeys cannot be moved when multiple are highlighted'
			: 'Move Quadkey Up'}
	>
		<button class="btn btn-sm {disabled ? 'btn-disabled' : ''}" on:click={() => changeQuadkey('up')}
			><ArrowBigUp /></button
		>
	</div>
	<div class="horizontal-arrows">
		<div
			class="tooltip"
			data-tip={disabled
				? 'Quadkeys cannot be moved when multiple are highlighted'
				: 'Move Quadkey Left'}
		>
			<button
				class="btn btn-sm {disabled ? 'btn-disabled' : ''}"
				on:click={() => changeQuadkey('left')}><ArrowBigLeft /></button
			>
		</div>
		<div
			class="tooltip"
			data-tip={disabled
				? 'Quadkeys cannot be moved when multiple are highlighted'
				: 'Move Quadkey Right'}
		>
			<button
				class="btn btn-sm {disabled ? 'btn-disabled' : ''}"
				on:click={() => changeQuadkey('right')}><ArrowBigRight /></button
			>
		</div>
	</div>
	<div
		class="tooltip"
		data-tip={disabled
			? 'Quadkeys cannot be moved when multiple are highlighted'
			: 'Move Quadkey Down'}
	>
		<button
			class="btn btn-sm {disabled ? 'btn-disabled' : ''}"
			on:click={() => changeQuadkey('down')}><ArrowBigDown /></button
		>
	</div>
</div>

<style>
	.arrows {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.horizontal-arrows {
		display: flex;
		justify-content: space-between;
		width: 100px;
	}
	button {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
	}
</style>
