<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<TabBar v-model="activeTab" v-bind="{ tabs }" />
		<div>
			<transition name="fade" mode="out-in">
				<KeepAlive>
					<component :is="tabs[activeTab].component" v-bind="{ partID }" />
				</KeepAlive>
			</transition>
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import TabBar from '@/components/TabBar.vue'
import PartDetails from './PartDetails.vue'
import PartInventory from './PartInventory.vue'
import { ref } from 'vue'

const props = defineProps([ 'partID' ]);

const activeTab = ref('details');
const tabs = {
	details: {
		label: 'Part Details',
		component: PartDetails,
	},
	inventory: {
		label: 'Inventory',
		component: PartInventory,
	}
};



</script>