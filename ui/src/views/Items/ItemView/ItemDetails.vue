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
						<textarea class="input w-full h-fit" :value="part.description" readonly placeholder="Part description"></textarea>
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
						<input type="text" class="input w-full h-fit" :value="item.serialNum" readonly placeholder="Serial number">
					</div>
				</div>
				
				<!-- Item schema fields -->
				<FormSchemaView class="mb-3" v-bind="{ schema: itemSchema, extended: item.extended }" />
			</template>
		</div>
	</div>
</template>
<script setup>
import FormSchemaView from '@/components/FormSchema/FormSchemaView.vue'
import { $api, $toast } from '@/services'
import { useConstantsStore } from '@/store/Constants'
import { useSchemaStore } from '@/store/Schema'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const props = defineProps([ 'itemID' ]);

const $schemaStore = useSchemaStore();
const $constantsStore = useConstantsStore();
const { PartCategoryMap } = storeToRefs($constantsStore);

const loading = ref(false);
const item = ref(null);
const part = ref(null);
const itemSchema = ref(null);
const partSchema = ref(null);

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