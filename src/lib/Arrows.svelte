<script lang="ts">
	import { handleArrowPress } from '$lib/utils';

	import { multiSelect, quadkeys } from '../stores';

	function handleKeyPress(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey) {
			$multiSelect = true;
			return;
		}

		let direction: string = '';
		switch (event.key) {
			case 'w':
				direction = 'up';
				break;
			case 'a':
				direction = 'left';
				break;
			case 's':
				direction = 'down';
				break;
			case 'd':
				direction = 'right';
				break;
		}
		if (!direction) return;

		changeQuadkey(direction);
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (!event.metaKey && !event.ctrlKey) {
			$multiSelect = false;
		}
	}

	function changeQuadkey(direction: string) {
		const newQuadkey = handleArrowPress($quadkeys, direction);
		if (newQuadkey) {
			$quadkeys = newQuadkey;
		}
	}
</script>

<svelte:window on:keydown={handleKeyPress} on:keyup={handleKeyUp} />

<div class="arrows p-3">
	<button on:click={() => changeQuadkey('up')}>⬆️</button>
	<div class="horizontal-arrows">
		<button on:click={() => changeQuadkey('left')}>⬅️</button>
		<button on:click={() => changeQuadkey('right')}>➡️</button>
	</div>
	<button on:click={() => changeQuadkey('down')}>⬇️</button>
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
