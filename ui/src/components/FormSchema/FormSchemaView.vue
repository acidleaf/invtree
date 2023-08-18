<template>
	<div v-if="schema" class="space-y-3">
		<div v-for="lt in schema.layout" class="md:flex md:gap-2 md:items-start md:justify-stretch md:space-y-0 space-y-3">
			<DynamicFormFieldView
				class="flex-grow"
				v-for="itemKey in lt"
				v-bind="{ schemaField: schema.fields[itemKey] }"
				:value="extended[itemKey]" />
		</div>
	</div>
</template>
<script setup>
import DynamicFormFieldView from './DynamicFormFieldView.vue'
const props = defineProps([ 'schema', 'extended' ]);

</script>