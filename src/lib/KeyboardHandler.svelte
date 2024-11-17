<script lang="ts">
	import { multiSelect } from '../stores';
	import { changeQuadkey } from '$lib/utils/arrow';

	function handleKeyPress(event: KeyboardEvent) {
		/** Handle a key press event, currently to do with moving and highlighting quadkeys
		 *
		 * @param {KeyboardEvent} event - The key press event
		 */
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
		/** Remove the multiSelect flag when the meta or ctrl key is released
		 *
		 * @param {KeyboardEvent} event - The key up event
		 */
		if (!event.metaKey && !event.ctrlKey) {
			$multiSelect = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeyPress} on:keyup={handleKeyUp} />
