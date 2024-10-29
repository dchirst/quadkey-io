<script lang="ts">
	export let onArrowPress: (direction: string) => void;

	function handleKeyPress(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				onArrowPress('up');
				break;
			case 'ArrowLeft':
				onArrowPress('left');
				break;
			case 'ArrowDown':
				onArrowPress('down');
				break;
			case 'ArrowRight':
				onArrowPress('right');
				break;
		}
	}

	function handleClick(direction: string) {
		onArrowPress(direction);
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="arrows">
	<button on:click={() => handleClick('up')}>⬆️</button>
	<div class="horizontal-arrows">
		<button on:click={() => handleClick('left')}>⬅️</button>
		<button on:click={() => handleClick('right')}>➡️</button>
	</div>
	<button on:click={() => handleClick('down')}>⬇️</button>
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
