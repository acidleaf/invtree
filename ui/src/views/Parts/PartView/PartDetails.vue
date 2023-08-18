<template>
	<div class="px-2 py-2">
		<preloader v-if="loading" />
		
		<div v-else-if="part">
			<!-- Fixed fields -->
			<div class="space-y-3 mb-3">
				<!-- Part number -->
				<div>
					<label class="label">Part Number</label>
					<input type="text" class="input w-full" :value="part.partNum" readonly placeholder="Part number">
				</div>
				
				<!-- Category -->
				<div>
					<label class="label">Category</label>
					<input type="text" class="input w-full"
						readonly
						placeholder="Part category"
						:value="PartCategoryMap[part.category] ? PartCategoryMap[part.category].name : 'Uncategorized'">
				</div>
				
				<!-- Part description -->
				<div>
					<label class="label">Description</label>
					<textarea class="input w-full" :value="part.description" readonly placeholder="Enter part description"></textarea>
				</div>
			</div>
			
			<!-- Extended fields -->
			<FormSchemaView v-bind="{ schema, extended: part?.extended }" />
			
			<!-- Edit actions-->
			<template v-if="canEdit">
				<hr>
				<div class="md:space-x-2 md:space-y-0 space-y-2">
					<router-link class="btn primary md:w-auto w-full" :loading="submitting" :to="`/parts/edit/${part._id}`">Edit Part</router-link>
					<router-link class="btn primary md:w-auto w-full" :loading="submitting" :to="`/items/new/${part._id}`">New Item</router-link>
					<button class="btn danger md:w-auto w-full" :loading="submitting" @click="deactivatePart">Deactivate Part</button>
				</div>
			</template>
		</div>
		
	</div>
</template>
<script setup>
import FormSchemaView from '@/components/FormSchema/FormSchemaView.vue'
import { $api, $confirm, $toast } from '@/services'
import { useAuthStore } from '@/store/Auth'
import { useConstantsStore } from '@/store/Constants'
import { UserScopes } from '@/utils/enums'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps([ 'partID' ]);

const $router = useRouter();
const $constantsStore = useConstantsStore();
const { PartCategoryMap } = storeToRefs($constantsStore);

const $authStore = useAuthStore();
const { scopes } = storeToRefs($authStore);

const loading = ref(false);
const submitting = ref(false);

const part = ref(null);
const schema = ref(null);

const canEdit = computed(() => {
	if (!part.value) return false;
	return scopes.value.includes(UserScopes.PARTS_EDIT);
});

async function deactivatePart() {
	if (!props.part) return;
	
	const confirm = await $confirm({
		title: 'Inactive Part',
		message: 'Confirm to deactivate this part?',
		buttons: 'YES_NO',
	});
	if (!confirm) return;
	
	submitting.value = true;
	try {
		await $api.request('DELETE', `parts/${props.part._id}`);
		$router.replace('/parts');
		$toast.info('Part deactivated');
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to inactive part');
	}
	submitting.value = false;
}


onMounted(async () => {
	loading.value = true;
	try {
		// Fetch part
		const res = await $api.request('GET', `parts/${props.partID}`);
		part.value = res;
		if (res.formSchema) {
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