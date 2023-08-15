<template>
	<div class="item-list grid-cols-3">
		<div v-for="(m, mi) in months" class="it rounded-lg"
			:class="{ active: monthActive(mi), disabled: monthDisabled(mi) }"
			@click="monthSelected(mi)">
			{{ m }}
		</div>
	</div>
</template>
<script setup>
const props = defineProps([ 'year', 'month', 'modelValue', 'range' ]);
const emit = defineEmits([ 'update:modelValue' ]);

const months = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function monthSelected(mi) { emit('update:modelValue', mi); }
function monthActive(mi) {
	if (props.modelValue instanceof Date) {
		const sd = props.modelValue;
		if (sd.getFullYear() == props.year && sd.getMonth() == mi) return true;
	}
	return false;
}
function monthDisabled(mi) {
	if (props.range) {
		const { from, to } = props.range;
		if (from) {
			if (props.year < from.year()) return true;
			else if (props.year == from.year()) return mi < from.month();
		}
		
		if (to) {
			if (props.year > to.year()) return true;
			else if (props.year == to.year()) return mi > to.month();
		}
	}
	return false;
}
</script>