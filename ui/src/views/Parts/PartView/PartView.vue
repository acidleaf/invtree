<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<TabBar v-model="activeTab" v-bind="{ tabs }" />
		
		<preloader v-if="loading" />
		<div v-else>
			<transition name="fade" mode="out-in">
				<component :is="tabs[activeTab].component" v-bind="{ part, schema }" />
			</transition>
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import { $api, $toast } from '@/services'
import { onMounted, ref } from 'vue'
import TabBar from '@/components/TabBar.vue'
import PartDetail from './PartDetail.vue'
import PartItems from './PartItems.vue'

const props = defineProps([ 'partID' ]);
const loading = ref(false);

const part = ref(null);
const schema = ref(null);

const activeTab = ref('details');
const tabs = {
	details: {
		label: 'Part Details',
		component: PartDetail,
	},
	items: {
		label: 'Usage',
		component: PartItems,
	}
};

onMounted(async () => {
	loading.value = true;
	try {
		// Fetch part
		const res = await $api.request('GET', `parts/${props.partID}`);
		part.value = res;
		if (res.formSchema) {
			// Fetch schema
			// TODO: Replace with cached version
			const schemaRes = await $api.request('GET', `schemas/form/${res.formSchema}`);
			schema.value = schemaRes;
		}
		
		
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load part');
	}
	loading.value = false;
});

</script>