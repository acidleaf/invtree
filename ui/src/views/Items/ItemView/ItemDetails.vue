<template>
	<div class="px-2 py-2">
		<preloader v-if="loading" />
		
		
		<div v-else>
			<!-- Part fields -->
			<template v-if="part">
				<div class="space-y-3 mb-3">
					<!-- Part number -->
					<div>
						<label class="label">Part Number</label>
						<div class="input w-full">{{ part.partNum }}</div>
					</div>
					
					<!-- Category -->
					<div>
						<label class="label">Category</label>
						<div class="input w-full">{{ PartCategoryMap[part.category] ? PartCategoryMap[part.category].name : 'Uncategorized' }}</div>
					</div>
					
					<!-- Part description -->
					<div>
						<label class="label">Description</label>
						<div class="input w-full whitespace-pre-wrap">{{ part.description }}</div>
					</div>
				</div>
				
				<!-- Part schema fields -->
				<FormSchemaView class="mb-3" v-bind="{ schema: partSchema, extended: part.extended }" />
			</template>
			<hr>
			
			<template v-if="item">
				<!-- Item fields -->
				<div class="space-y-3 mb-3">
					<div>
						<label class="label">Serial Number</label>
						<div class="input w-full">{{ item.serialNum }}</div>
					</div>
				</div>
				
				<!-- Item schema fields -->
				<FormSchemaView class="mb-3" v-bind="{ schema: itemSchema, extended: item.extended }" />
			</template>
			
			
			<template v-if="canEdit">
				<hr>
				<div class="md:space-x-2 md:space-y-0 space-y-2">
					<router-link class="btn primary md:w-auto w-full" :loading="submitting" :to="`/items/edit/${item._id}`">Edit Item</router-link>
					<button class="btn danger md:w-auto w-full" :loading="submitting" @click="deactivateItem">Deactivate Item</button>
				</div>
			</template>
		</div>
	</div>
</template>
<script setup>
import FormSchemaView from '@/components/FormSchema/FormSchemaView.vue'
import { $api, $toast } from '@/services'
import { useAuthStore } from '@/store/Auth'
import { useConstantsStore } from '@/store/Constants'
import { useSchemaStore } from '@/store/Schema'
import { UserScopes } from '@/utils/enums'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps([ 'itemID' ]);

const $router = useRouter();
const $authStore = useAuthStore();
const $schemaStore = useSchemaStore();
const $constantsStore = useConstantsStore();
const { scopes } = storeToRefs($authStore);
const { PartCategoryMap } = storeToRefs($constantsStore);

const loading = ref(false);
const submitting = ref(false);
const item = ref(null);
const part = ref(null);
const itemSchema = ref(null);
const partSchema = ref(null);


const canEdit = computed(() => {
	if (!item.value) return false;
	return scopes.value.includes(UserScopes.ITEMS_EDIT);
});

async function deactivateItem() {
	if (!props.itemID) return;
	
	const confirm = await $confirm({
		title: 'Deactivate Item',
		message: 'Confirm to deactivate this item?',
		buttons: 'YES_NO',
	});
	if (!confirm) return;
	
	submitting.value = true;
	try {
		await $api.request('DELETE', `items/${props.itemID}`);
		$router.replace('/items');
		$toast.info('Item deactivated');
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to inactive part');
	}
	submitting.value = false;
}


onMounted(async () => {
	loading.value = true;
	try {
		
		const res = await $api.request('GET', `items/${props.itemID}`);
		item.value = res;
		part.value = res.part;
		
		// Populate schema
		if (item.value.formSchema) itemSchema.value = await $schemaStore.resolve(item.value.formSchema);
		if (part.value.formSchema) partSchema.value = await $schemaStore.resolve(part.value.formSchema);
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load item');
	}
	loading.value = false;
});

</script>