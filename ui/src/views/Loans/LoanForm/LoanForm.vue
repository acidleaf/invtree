<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
			<!-- Fixed fields -->
			<div class="space-y-3 mb-3">
				
				<!-- Schema selection -->
				<div v-if="showSchemaList">
					<label class="label">Loan Type</label>
					<select class="input w-full" v-model="schemaID">
						<option :value="null" disabled>Select loan type</option>
						<option v-for="(ls, key) in LoanSchemas" :value="key">{{ ls.name }}</option>
					</select>
				</div>
				
				
				
				<!-- Loan number -->
				<div>
					<label class="label">Loan Number</label>
					<input type="text" class="input w-full" v-model.trim="formData.loanNum" placeholder="Loan number">
				</div>
				
				<!-- Remarks -->
				<div>
					<label class="label">Remarks</label>
					<textarea class="input w-full" v-model.trim="formData.remarks" placeholder="Enter remarks"></textarea>
				</div>
			</div>
			
			<!-- Extended fields -->
			<FormSchemaEdit v-bind="{ schema, formData }" />
			
			<hr>
			<div class="space-x-2">
				<button class="btn primary" :loading="submitting" @click="save">Save</button>
			</div>
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import { $api, $toast } from '@/services'
import { onMounted, ref, reactive, watch } from 'vue'
import { useConstantsStore } from '@/store/Constants'
import { useSchemaStore } from '@/store/Schema'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import FormSchemaEdit from '@/components/FormSchema/FormSchemaEdit.vue'

const $router = useRouter();
const $schemaStore = useSchemaStore();
const $constantsStore = useConstantsStore();
const { LoanSchemas } = storeToRefs($schemaStore);

const props = defineProps([ 'partID' ]);
const loading = ref(false);
const submitting = ref(false);
const showSchemaList = ref(false);
const loan = ref(null);

const schemaID = ref(null);
const schema = ref(null);

const formData = reactive({
	loanNum: '',
	loanDate: null,
	dueDate: null,
	formSchema: null,
});




function updateFormData() {
	if (!schema.value || !loan.value) return;
	
	const sch = schema.value;
	for (const i in sch.fields) {
		let value = '';
		if (loan.value.extended && loan.value.extended[i]) value = loan.value.extended[i];
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
		const loanSchemas = Object.keys(LoanSchemas.value);
		
		
		
		if (props.loanID) {
			// Modify existing part
			const res = await $api.request('GET', `loans/${props.loanID}`);
			loan.value = res;
			
			// Populate base formData
			formData.loanNum = res.loanNum;
			formData.loanDate = res.loanDate;
			formData.dueDate = res.dueDate;
			
			// Fetch schema
			if (res.formSchema) {
				schema.value = await $schemaStore.resolve(res.formSchema);
				if (!schema.value) throw 'invalid_schema';
				schemaID.value = schema.value._id;
				updateFormData();
			}
			showSchemaList.value = false;
			
		} else {
			// New loan creation
			// Determine schema selection
			if (loanSchemas.length < 2) {
				schema.value = await $schemaStore.resolve(loanSchemas[0]);
				if (loanSchemas.length == 1) schemaID.value = schema.value._id;
				showSchemaList.value = false;
			} else {
				showSchemaList.value = true;
			}
			
			// Imply selection when there's only one type
			if (loanSchemas.length < 2) {
				if (loanSchemas.length == 1) formData.formSchema = loanSchemas[0]._id;
				showSchemaList.value = false;
			} else {
				showSchemaList.value = true;
			}
			
		}
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load loan');
	}
	loading.value = false;
});

</script>