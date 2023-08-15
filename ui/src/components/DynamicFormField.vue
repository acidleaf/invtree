<template>
	<div>
		<label class="label">{{ schemaField.label }}</label>
		
		<template v-if="schemaField.elementType == 'text'">
			<input
				class="input w-full"
				:type="schemaField.inputType || 'text'"
				:value="modelValue"
				:placeholder="schemaField.placeholder">
		</template>
		
		<template v-if="schemaField.elementType == 'textarea'">
			<textarea
				class="input w-full"
				:type="schemaField.inputType || 'text'"
				:value="modelValue"
				:placeholder="schemaField.placeholder">
			</textarea>
		</template>
		
		<template v-if="schemaField.elementType == 'radio'">
			<label v-for="(c, key) in schemaField.choices" class="input-choice">
				<input type="radio" :value="key">
				<span class="font-medium ml-2">{{ c }}</span>
			</label>
		</template>
		
		<template v-if="schemaField.elementType == 'checkbox'">
			<label class="input-choice">
				<input type="checkbox" :value="modelValue">
				<span class="font-medium ml-2">{{ schemaField.label }}</span>
			</label>
		</template>
		
	</div>
</template>
<script setup>
const props = defineProps([ 'schemaField', 'modelValue' ]);


</script>