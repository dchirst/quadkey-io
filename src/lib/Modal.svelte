<!-- You can open the modal using ID.showModal() method -->
<script lang="ts">
	import { showImportModal } from '../stores';

	function toggleModal() {
		console.log('toggleModal', $showImportModal);
		$showImportModal = !$showImportModal;
	}
</script>

<dialog class="modal" class:modal-open={$showImportModal}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" on:click={toggleModal}
				>✕</button
			>
		</form>
		<slot />
	</div>
</dialog>
