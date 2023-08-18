<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
			<div v-if="part" class="space-y-3 mb-4">
				<div>
					<label class="label">Part Number</label>
					<input type="text" class="input w-full" :value="part.partNum" readonly>
				</div>
				
				<div>
					<label class="label">Category</label>
					<input type="text" class="input w-full" :value="part.category ? PartCategoryMap[part.category].name : 'Uncategorized'" readonly>
				</div>
			</div>
			<hr>
			
			
			<div class="space-y-3 mb-3">
				<!-- Serial number -->
				<div>
					<label class="label">Serial Number</label>
					<input type="text" class="input w-full" v-model.trim="formData.serialNum" placeholder="Item serial number">
				</div>
				
				
			</div>
			
			<FormSchemaEdit v-bind="{ schema: itemSchema, formData }" />
			
			
			<hr>
			<div>
				<button class="btn primary" :loading="submitting" @click="save">Save</button>
			</div>
			
		</div>
		
		
	</Container>
</template>
<script setup>
import DynamicFormField from '@/components/FormSchema/DynamicFormField.vue'
import FormSchemaEdit from '@/components/FormSchema/FormSchemaEdit.vue'
import Container from '@/layouts/Container.vue'
import { $api, $toast } from '@/services'
import { useConstantsStore } from '@/store/Constants'
import { useSchemaStore } from '@/store/Schema'
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps([ 'partID', 'itemID' ]);

const $route = useRoute();
const $router = useRouter();
const $constantsStore = useConstantsStore();
const $schemaStore = useSchemaStore();
const { PartCategoryMap } = storeToRefs($constantsStore);

const loading = ref(false);
const submitting = ref(false);
const item = ref(null);
const part = ref(null);

const itemSchemaID = ref(null);
const itemSchema = ref(null);

const formData = reactive({
	serialNum: '',
});



function updateFormData() {
	if (!itemSchema.value) return;
	
	const sch = itemSchema.value;
	for (const i in sch.fields) {
		let value = '';
		if (item.value && item.value.extended && item.value.extended[i]) value = item.value.extended[i];
		formData[i] = value;
	}
}

function prepareFormData() {
	const data = {
		partID: part.value._id,
		serialNum: formData.serialNum,
		formSchema: itemSchemaID.value,
	};
	
	if (itemSchema.value) {
		const extended = {};
		for (const i in itemSchema.value.fields) {
			extended[i] = formData[i];
		}
		data.extended = extended;
	}
	
	return data;
}

function validate() {
	if (!formData.serialNum) {
		$toast.error('Serial number cannot be blank');
		return false;
	}
	return true;
}
async function save() {
	if (!validate()) return;
	
	submitting.value = true;
	try {
		const data = prepareFormData();
		if (props.itemID) {
			// Update existing item
			await $api.request('PUT', `items/${props.itemID}`, data);
			$toast.success('Item updated');
			
		} else {
			// Create new item
			const res = await $api.request('POST', `items`, data);
			$router.replace(`/items/edit/${res._id}`);
			$toast.success('Item created');
		}
		
		
	} catch (err) {
		console.error(err);
		$toast.error('Error saving item');
	}
	submitting.value = false;
}

onMounted(async () => {
	loading.value = true;
	try {
		
		if (props.partID) {
			// If partID is set, we are creating a new item from given part
			part.value = await $api.request('GET', `parts/${props.partID}`);
			if (part.value.itemSchema) itemSchemaID.value = part.value.itemSchema;
			
		} else if (props.itemID) {
			// If itemID is set, we are modifying an existing item
			const res = await $api.request('GET', `items/${props.itemID}`);
			item.value = res;
			part.value = res.part;
			itemSchemaID.value = res.formSchema;
			
			// Update base formData
			formData.serialNum = res.serialNum;
			
		} else {
			throw 'invalid_params';
		}
		
		
		// Load item schema
		if (itemSchemaID.value) {
			itemSchema.value = await $schemaStore.resolve(itemSchemaID.value);
			updateFormData();
		}
		
		
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load item');
	}
	loading.value = false;
});

</script>