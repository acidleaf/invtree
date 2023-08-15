<template>
	<form @submit.prevent="performSearch" class="flex items-center gap-2">
		<!-- Query input -->
		<input type="text" class="input" :class="inputClass" :placeholder="placeholder" v-model.trim="query" :disabled="loading">
		
		<!-- Clear button -->
		<button v-if="searching" type="button" class="btn" :loading="loading" title="Clear search" @click="clearSearch">
			<icon :data="mdiRefresh" />
		</button>
		
		<!-- Search button -->
		<button class="btn accent" title="Search" :loading="loading">
			<icon :data="mdiMagnify" />
		</button>
		
		
	</form>
</template>
<script setup>
import { mdiMagnify, mdiRefresh } from '@mdi/js'
import { ref } from 'vue'


const props = defineProps({
	modelValue: String,
	loading: Boolean,
	inputClass: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: 'Search',
	},
});

const $emit = defineEmits([ 'update:modelValue', 'search', 'clear' ]);
const searching = ref(false);
const query = ref('');

function performSearch() {
	if (!query.value) return;
	
	searching.value = true;
	$emit('update:modelValue', query.value);
	$emit('search');
}

function clearSearch() {
	searching.value = false;
	query.value = '';
	$emit('update:modelValue', query.value);
	$emit('clear');
}


</script>