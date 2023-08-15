<template>
	<Accordion>
		<template #header>
			<div class="flex items-center gap-2 hover:bg-gray-200 transition-colors px-3 py-2 select-none cursor-pointer font-medium">
				<icon v-if="icon" :data="icon" />
				<div>{{ label }}</div>
			</div>
		</template>
		
		<template #default="{ close }">
			<div
				v-for="link in links"
				:key="link.path"
				class="hover:bg-gray-200 hover:no-underline transition-colors duration-200 cursor-pointer">
				<router-link
					:to="link.path"
					@click.native.prevent="onClick(close)"
					class="block px-4 py-1 text-gray-400 text-sm font-medium hover:text-gray-600 hover:no-underline">
					{{ link.label }}
				</router-link>
			</div>
		</template>
	</Accordion>
</template>
<script setup>
import Accordion from '@/components/Accordion.vue'
import { $sidebar } from '@/services'

const props = defineProps([ 'icon', 'label', 'links' ]);

function onClick(closeAccordion) {
	$sidebar.hide();
	closeAccordion();
}

</script>