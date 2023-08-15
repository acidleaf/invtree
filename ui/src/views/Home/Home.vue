<template>
	<Container>
		<div class="space-y-2">
			<div class="flex gap-2">
				<button class="btn primary space-x-2" @click="showModal">
					<icon :data="mdiCheck" />
					<span>Button with Icon</span>
				</button>
				
				<router-link to="/theme" class="btn primary">View Theme</router-link>
			</div>
			
			
			<div class="flex gap-2">
				<button class="btn accent" @click="showModal">Show Confirm</button>
				
				<button class="btn info" @click="showToast">Show Toast</button>
				
			</div>
		</div>
		
	</Container>
</template>
<script setup>
import { $confirm } from '@/services'
import { mdiCheck } from '@mdi/js'
import Container from '@/layouts/Container.vue'
import { $toast } from '@/services'

async function showModal() {
	await $confirm({
		title: 'Confirm?',
		message: 'Confirm with message\nYes or no',
		buttons: 'YES_NO',
	});
}


async function showToast() {
	await $toast.info('This is a toast');
}

</script>
