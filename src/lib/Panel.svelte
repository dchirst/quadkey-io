<script>
import QuadkeyInfo from '$lib/QuadkeyInfo.svelte';
import Import from '$lib/Import.svelte';
import Intro from '$lib/Intro.svelte';
import ControlPanel from '$lib/ControlPanel.svelte';
import PanelElement from '$lib/PanelElement.svelte';

</script>

<PanelElement>
		<Intro  />
	<div class="divider"></div>
	<QuadkeyInfo />
	<div class="divider "></div>
	<ControlPanel />
	<div class="divider"></div>
	<!-- You can open the modal using ID.showModal() method -->
	<Import />
</PanelElement>