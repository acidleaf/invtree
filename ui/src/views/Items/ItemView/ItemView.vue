<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		
		<TabBar v-model="activeTab" v-bind="{ tabs }" />
		
		<preloader v-if="loading" />
		<div v-else>
			<transition name="fade" mode="out-in">
				<KeepAlive>
					<component :is="tabs[activeTab].component" v-bind="{ itemID }" />
				</KeepAlive>
			</transition>
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import TabBar from '@/components/TabBar.vue'
import ItemDetails from './ItemDetails.vue'
import LoanHistory from './LoanHistory.vue'
import { ref } from 'vue'

const props = defineProps([ 'itemID' ]);

const loading = ref(false);

const activeTab = ref('details');
const tabs = {
	details: {
		label: 'Item Details',
		component: ItemDetails,
	},
	loans: {
		label: 'Loan History',
		component: LoanHistory,
	}
};



</script>