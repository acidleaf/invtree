<template>
	<!-- Week headers and dates -->
	<div class="item-list grid-cols-7">
		
		<!-- Row of week headers -->
		<div v-for="wd in weekdayNames" class="font-medium text-black dark:text-white">{{ wd }}</div>
		
		<!-- Individual dates -->
		<div v-for="d in monthDates" class="it rounded-full"
			:class="{ active: dateActive(d), disabled: dateDisabled(d) }"
			@click="dateSelected(d)">
			{{ d }}
		</div>
		
	</div>
</template>
<script setup>
import dayjs from 'dayjs'
import { computed } from 'vue'

const props = defineProps([ 'year', 'month', 'date', 'modelValue', 'range' ]);
const emit = defineEmits([ 'update:modelValue' ]);

const weekdayNames = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

const monthDates = computed(() => {
	let dates = [];
	
	const firstDay = dayjs(new Date(props.year, props.month, 1));
	const blankDays = firstDay.day();
	for (let i = 0; i < blankDays; ++i) {
		dates.push('');
	}
	
	for (let i = 0; i < firstDay.daysInMonth(); ++i) {
		dates.push(i + 1);
	}
	
	return dates;
});

function dateSelected(d) { emit('update:modelValue', d); }

function dateActive(d) {
	if (props.modelValue instanceof Date) {
		const sd = props.modelValue;
		if (sd.getFullYear() == props.year && sd.getMonth() == props.month && sd.getDate() == d) {
			return true;
		}
	}
	return false;
}

function dateDisabled(d) {
	if (!d) return true;
	if (props.range) {
		const { from, to } = props.range;
		const now = `${props.year}${(props.month + 1).toString().padStart(2, '0')}${d.toString().padStart(2, '0')}`;
		if (from && now < from.format('YYYYMMDD')) return true;
		else if (to && now > to.format('YYYYMMDD')) return true;
	}
	return false;
}


</script>