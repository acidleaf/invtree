<template>
	<div class="item-list grid-cols-3">
		<div v-for="y in yearList" :key="y" class="it rounded-lg"
			:class="{ active: yearActive(y), disabled: yearDisabled(y) }"
			@click="yearSelected(y)">
			{{ y }}
		</div>
	</div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps([ 'year', 'modelValue', 'range' ]);
const emit = defineEmits([ 'update:modelValue' ]);

const yearMin = computed(() => { return Math.floor(props.year / 12) * 12; });
const yearMax = computed(() => { return yearMin.value + 11; });
const yearList = computed(() => {
	const years = [];
	for (let i = yearMin.value; i <= yearMax.value; ++i) { years.push(i); }
	return years;
});

function yearSelected(y) { emit('update:modelValue', y); }
function yearActive(y) {
	if (props.modelValue instanceof Date) {
		const sd = props.modelValue;
		return sd.getFullYear() == y;
	}
	return false;
}

function yearDisabled(y) {
	if (props.range) {
		const { from, to } = props.range;
		if (from && y < from.year()) return true;
		else if (to && y > to.year()) return true;
	}
	return false;
}

</script>