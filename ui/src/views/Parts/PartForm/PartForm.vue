<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
			<!-- Fixed fields -->
			<div class="space-y-3">
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
			
			<div>
				<label class="label">Part Type</label>
				<select class="input w-full" v-model="formData.formSchema">
					<option :value="null">Generic</option>
					<option v-for="(ps, key) in PartSchemas" :value="key">{{ ps.name }}</option>
				</select>
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
import { onMounted, ref, reactive, computed } from 'vue'
import { useConstantsStore } from '@/store/Constants'
import { useSchemaStore } from '@/store/Schema'
import { storeToRefs } from 'pinia'


const $schemaStore = useSchemaStore();
const $constantsStore = useConstantsStore();
const { partCategories } = storeToRefs($constantsStore);
const { PartSchemas } = storeToRefs($schemaStore);

const props = defineProps([ 'partID' ]);
const loading = ref(false);
const submitting = ref(false);
const part = ref(null);
const schema = ref(null);


const formData = reactive({
	partNum: '',
	category: null,
	description: '',
	formSchema: null,
});


const showSchemaSelect = computed(() => {
	if (props.partID) return false;
	
});


function updateFormData() {
	if (!schema.value) return;
	
	const sch = schema.value;
	for (const i in sch.fields) {
		let value = '';
		if (part.value.extended && part.value.extended[i]) value = part.value.extended[i];
		formData[i] = value;
	}
}

function prepareFormData() {
	const data = {
		partNum: formData.partNum,
		category: formData.category,
		description: formData.description,
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

async function save() {
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
		
		if (props.partID) {
			// Fetch part
			const res = await $api.request('GET', `parts/${props.partID}`);
			part.value = res;
			
			// Populate base formData
			formData.partNum = res.partNum;
			formData.category = res.category;
			formData.description = res.description;
			
			// Fetch schema
			if (res.formSchema) {
				schema.value = await $schemaStore.resolve(res.formSchema);
				if (!schema.value) throw 'invalid_schema';
				updateFormData();
			}
		} else {
			// New part
			
			
		}
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load part');
	}
	loading.value = false;
});

</script>