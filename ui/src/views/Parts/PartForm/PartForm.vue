<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
			<!-- Fixed fields -->
			<div class="space-y-3">
				
				<!-- Schema selection -->
				<div v-if="showPartSchemaList">
					<label class="label">Part Type</label>
					<select class="input w-full" v-model="schemaID">
						<option :value="null" disabled>Select part type</option>
						<option v-for="(ps, key) in PartSchemas" :value="key">{{ ps.name }}</option>
					</select>
				</div>
				
				<!-- Item schema -->
				<div v-if="showItemSchemaList">
					<label class="label">Item Type</label>
					<select class="input w-full" v-model="formData.itemSchema">
						<option v-for="is in ItemSchemas" :value="is._id">{{ is.name }}</option>
					</select>
				</div>
				
				<!-- Part number -->
				<div>
					<label class="label">Part Number</label>
					<input type="text" class="input w-full" v-model.trim="formData.partNum" placeholder="Part number">
				</div>
				
				<!-- Category -->
				<div>
					<label class="label">Category</label>
					<select class="input w-full" v-model="formData.category">
						<option :value="null">Uncategorized</option>
						<option v-for="cat in partCategories" :value="cat._id">{{ cat.name }}</option>
					</select>
				</div>
				
				<!-- Part description -->
				<div>
					<label class="label">Description</label>
					<textarea class="input w-full" v-model.trim="formData.description" placeholder="Enter part description"></textarea>
				</div>
			</div>
			
			<!-- Extended fields -->
			<div v-if="schema" class="space-y-3">
				<div v-for="lt in schema.layout" class="md:flex md:gap-2 md:items-start md:justify-stretch md:space-y-0 space-y-3">
					<DynamicFormField
						class="flex-grow"
						v-for="itemKey in lt"
						v-bind="{ schemaField: schema.fields[itemKey] }"
						v-model="formData[itemKey]" />
				</div>
			</div>
			
			<hr>
			<div class="space-x-2">
				<button class="btn primary" :loading="submitting" @click="save">Save</button>
			</div>
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import DynamicFormField from '@/components/DynamicFormField.vue'
import { $api, $toast } from '@/services'
import { onMounted, ref, reactive, watch } from 'vue'
import { useConstantsStore } from '@/store/Constants'
import { useSchemaStore } from '@/store/Schema'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const $router = useRouter();
const $schemaStore = useSchemaStore();
const $constantsStore = useConstantsStore();
const { partCategories } = storeToRefs($constantsStore);
const { PartSchemas, ItemSchemas } = storeToRefs($schemaStore);

const props = defineProps([ 'partID' ]);
const loading = ref(false);
const submitting = ref(false);
const showPartSchemaList = ref(false);
const showItemSchemaList = ref(false);
const part = ref(null);

const schemaID = ref(null);
const schema = ref(null);

const formData = reactive({
	partNum: '',
	category: null,
	itemSchema: null,
	description: '',
});




function updateFormData() {
	if (!schema.value || !part.value) return;
	
	const sch = schema.value;
	for (const i in sch.fields) {
		let value = '';
		if (part.value.extended && part.value.extended[i]) value = part.value.extended[i];
		formData[i] = value;
	}
}
watch(schemaID, async () => {
	if (schemaID.value == null) {
		schema.value = null;
		return;
	}
	if (schemaID.value == schema._id) return;
	
	try {
		const newSchema = await $schemaStore.resolve(schemaID.value);
		schema.value = newSchema;
		updateFormData();
		
	} catch (err) {
		console.error(err);
		$toast.error('Invalid schema');
	}
})


function prepareFormData() {
	const data = {
		partNum: formData.partNum,
		category: formData.category,
		description: formData.description,
		itemSchema: formData.itemSchema,
		formSchema: schemaID.value,
	};
	
	// Build schema properties
	if (schema.value) {
		const extended = {};
		for (const i in schema.value.fields) {
			extended[i] = formData[i];
		}
		data.extended = extended;
	}
	return data;
}


function validate() {
	if (!formData.partNum) {
		$toast.error('Part number cannot be empty');
		return false;
	}
	
	if (schema.value) {
		for (const i in schema.value.fields) {
			const f = schema.value.fields[i];
			if (f.required && f.elementType != 'checkbox' && !formData[i]) {
				$toast.error(`Field "${f.label}" is required`);
				return false;
			}
		}
	}
	
	return true;
}


async function save() {
	if (!validate()) return;
	
	submitting.value = true;
	try {
		const data = prepareFormData();
		if (props.partID) {
			// Update existing part
			await $api.request('PUT', `parts/${props.partID}`, data);
			$toast.success('Part details updated');
			
		} else {
			// Create new part
			const res = await $api.request('POST', `parts`, data);
			$router.replace(`/parts/edit/${res._id}`);
			$toast.success('Part created successfully');
		}
		
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to save changes');
	}
	submitting.value = false;
}





onMounted(async () => {
	loading.value = true;
	try {
		
		// Check the number of schemas available
		const partSchemas = Object.keys(PartSchemas.value);
		const itemSchemas = Object.keys(ItemSchemas.value);
		
		
		
		if (props.partID) {
			// Modify existing part
			const res = await $api.request('GET', `parts/${props.partID}`);
			part.value = res;
			
			// Populate base formData
			formData.partNum = res.partNum;
			formData.category = res.category;
			formData.description = res.description;
			formData.itemSchema = res.itemSchema;
			
			// Fetch schema
			if (res.formSchema) {
				schema.value = await $schemaStore.resolve(res.formSchema);
				if (!schema.value) throw 'invalid_schema';
				schemaID.value = schema.value._id;
				updateFormData();
			}
			showPartSchemaList.value = false;
			if (itemSchemas.length < 2) showItemSchemaList.value = false;
			
		} else {
			// New part creation
			// Determine schema selection
			if (partSchemas.length < 2) {
				schema.value = await $schemaStore.resolve(partSchemas[0]);
				if (partSchemas.length == 1) schemaID.value = schema.value._id;
				showPartSchemaList.value = false;
			} else {
				showPartSchemaList.value = true;
			}
			
			// Imply selection when there's only one type
			if (itemSchemas.length < 2) {
				if (itemSchemas.length == 1) formData.itemSchema = itemSchemas[0]._id;
				showItemSchemaList.value = false;
			} else {
				showItemSchemaList.value = true;
			}
			
		}
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load part');
	}
	loading.value = false;
});

</script>