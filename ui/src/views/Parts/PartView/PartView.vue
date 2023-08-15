<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
			<PartDetailForm v-bind="{ part, schema }" />
			
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import { $api, $toast } from '@/services'
import { onMounted, ref } from 'vue'
import PartDetailForm from './PartDetailForm.vue'

const props = defineProps([ 'partID' ]);
const loading = ref(false);

const part = ref(null);
const schema = ref(null);

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