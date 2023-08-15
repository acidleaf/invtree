<template>
	<div class="flex items-end hide-scroll overflow-x-auto" v-bind="$attrs">
		<div
			v-for="(t, key) in tabs"
			:key="key"
			@click="emit('update:modelValue', key)"
			class="text-center select-none cursor-pointer font-medium px-4 py-2 border-b-2 tracking-wide leading-tight transition-colors"
			:class="tabClasses(key)">
			
			<slot v-bind="{ key, label: tabLabel(t) }">{{ tabLabel(t) }}</slot>
			
		</div>
	</div>
	
	<!-- Line below tabs -->
	<div class="bg-gray-300 dark:bg-gray-700 w-full -mt-[2px] h-[2px]"></div>
	
</template>
<script setup>

const emit = defineEmits([ 'update:modelValue' ]);
const props = defineProps({
	modelValue: [String, Number],
	tabs: Object,
	tabClass: String,
});

function tabLabel(t) {
	return t.label === undefined ? t : t.label;
}
function tabClasses(key) {
	let classes = '';
	if (key == props.modelValue) classes = 'text-accent-600 border-accent';
	else classes = 'border-gray-300 hover:border-accent-300 dark:text-gray-500 dark:border-gray-700 dark:hover:border-accent dark:hover:text-gray';
	
	if (props.tabClass) classes += ` ${props.tabClass}`;
	
	return classes;
}


</script>