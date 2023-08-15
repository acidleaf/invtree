<template>
	<div>
		<!-- Fixed fields -->
		<div v-if="part" class="space-y-3">
			<!-- Part number -->
			<div>
				<label class="label">Part Number</label>
				<input type="text" class="input w-full" v-model.trim="part.partNum" placeholder="Part number">
			</div>
			
			<!-- Category -->
			<div>
				<label class="label">Category</label>
				<select class="input w-full" v-model="part.category">
					<option :value="null">Select category</option>
				</select>
			</div>
			
			<!-- Part description -->
			<div>
				<label class="label">Description</label>
				<textarea class="input w-full" v-model.trim="part.description" placeholder="Enter part description"></textarea>
			</div>
		</div>
		
		<!-- Extended fields -->
		<div v-if="schema" class="space-y-3">
			<div v-for="lyt in schema.layout" class="flex gap-2 items-center justify-evenly">
				<DynamicFormField
					class="flex-grow"
					v-for="itemKey in lyt"
					v-bind="{ schemaField: schema.fields[itemKey] }"
					v-model="part.extended[itemKey]" />
			</div>
		</div>
		
	</div>
</template>
<script setup>
import DynamicFormField from '@/components/DynamicFormField.vue'


const props = defineProps([ 'part', 'schema' ]);




</script>