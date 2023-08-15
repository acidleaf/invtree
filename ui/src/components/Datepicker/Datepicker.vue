<template>
	<div>
		<!-- The input -->
		<input readonly :class="inputClass" :disabled="disabled" :placeholder="placeholder" @click="showPicker = true" :value="displayedDate">
		
		<!-- Embedded modal -->
		<Modal v-model="showPicker" containerClass="p-1 md:w-auto w-full mx-4">
			<PickerHeader v-bind="{ enablePrev, enableNext }" @prev="movePage(-1)" @next="movePage(1)">
				<transition name="fade" mode="out-in">
					<span :key="pickerTitle" class="cursor-pointer font-semibold hover:text-accent transition-colors" @click="switchMode">
						{{ pickerTitle }}
					</span>
				</transition>
			</PickerHeader>
			
			<!-- Show date, month or year selection -->
			<transition name="fade" mode="out-in">
				<div class="overflow-hidden mb-4 px-1" :key="`${mode}-${year}-${month}`">
					<component :is="activeComponent.component"
						@update:modelValue="activeComponent.inputHandler"
						v-bind="{
							year,
							month,
							date,
							modelValue: curDate,
							range: activeRange,
						}" />
				</div>
			</transition>
			
			<div class="px-2 pb-2 flex items-center gap-2">
				<button class="btn accent w-full" @click="selectToday">Today</button>
				<button class="btn primary w-full" @click="clearValue">Clear</button>
			</div>
		</Modal>
	</div>
</template>
<script setup>
import Modal from '@/components/Modal.vue'
import PickerHeader from './PickerHeader.vue'
import DateSelect from './DateSelect.vue'
import MonthSelect from './MonthSelect.vue'
import YearSelect from './YearSelect.vue'
import { ref, computed, nextTick, onMounted } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
	modelValue: [ String, Date ],
	format: {
		type: String,
		default: 'YYYY-MM-DD'
	},
	inputClass: {
		type: [ String, Array ],
		default: 'input'
	},
	minDate: {
		type: [ String, Date ],
		default: null,
	},
	maxDate: {
		type: [ String, Date ],
		default: null,
	},
	minLevel: {
		type: String,
		default: null,
		validator(val) {
			return ['date', 'month', 'year'].includes(val);
		}
	},
	showClearBtn: {
		type: Boolean,
		default: true,
	},
	placeholder: String,
	disabled: Boolean,
});
const emit = defineEmits([ 'update:modelValue' ]);

//const modeLevels = [ 'date', 'month', 'year' ];
const monthNames = [
	'January', 'February', 'March',
	'April', 'May', 'June',
	'July', 'August', 'September',
	'October', 'November', 'December'
];

const showPicker = ref(false);
const mode = ref('date');
const year = ref(null);
const month = ref(null);
const date = ref(null);




const pickerTitle = computed(() => {
	if (mode.value == 'date') return `${monthNames[month.value]} ${year.value}`;
	else if (mode.value == 'month') return year.value.toString();
	else if (mode.value == 'year') {
		const from = Math.floor(year.value / 12) * 12;
		const to = from + 11;
		return `${from} - ${to}`;
	}
});

const activeRange = computed(() => {
	const from = dayjs(props.minDate);
	const to = dayjs(props.maxDate);
	return {
		from: from.isValid() ? from : null,
		to: to.isValid() ? to : null,
	}
});

const enableNext = computed(() => {
	const to = activeRange.value.to;
	if (!to) return true;
	
	if (mode.value == 'date') {
		return `${year.value}${(month.value + 1).toString().padStart(2, '0')}` < to.format('YYYYMM');
	} else if (mode.value == 'month') {
		return year.value < to.year();
	} else if (mode.value == 'year') {
		const toYear = Math.floor(year.value / 12) * 12 + 11;
		return toYear < to.year();
	}
	
	return false;
});

const enablePrev = computed(() => {
	const from = activeRange.value.from;
	if (!from) return true;
	
	if (mode.value == 'date') {
		return `${year.value}${(month.value + 1).toString().padStart(2, '0')}` > from.format('YYYYMM');
	} else if (mode.value == 'month') {
		return year.value > from.year();
	} else if (mode.value == 'year') {
		const fromYear = Math.floor(year.value / 12) * 12;
		return fromYear > from.year();
	}
	
	return false;
});

const displayedDate = computed(() => {
	const date = dayjs(props.modelValue);
	if (!date.isValid()) return '';
	return date.format(props.format);
});

const curDate = computed(() => {
	const date = dayjs(props.modelValue);
	if (!date.isValid()) return '';
	return date.toDate();
});

const activeComponent = computed(() => {
	const components = {
		date: {
			component: DateSelect,
			inputHandler: dateSelected,
		},
		month: {
			component: MonthSelect,
			inputHandler: monthSelected,
		},
		year: {
			component: YearSelect,
			inputHandler: yearSelected,
		},
	};
	return components[mode.value];
});


function selectToday() {
	const today = new Date();
	date.value = today.getDate();
	month.value = today.getMonth();
	year.value = today.getFullYear();
	mode.value = 'date';
	emit('update:modelValue', today);
	nextTick(() => showPicker.value = false);
}
function dateSelected(d) {
	date.value = d;
	emit('update:modelValue', new Date(year.value, month.value, date.value));
	nextTick(() => showPicker.value = false);
}
function monthSelected(m) {
	month.value = m;
	if (props.minLevel != 'month') mode.value = 'date';
	else {
		emit('update:modelValue', new Date(year.value, month.value, 1));
		nextTick(() => { showPicker.value = false; });
	}
}
function yearSelected(y) {
	year.value = y;
	if (props.minLevel != 'year') mode.value = 'month';
	else {
		emit('update:modelValue', new Date(year.value, 0, 1));
		nextTick(() => { showPicker.value = false; });
	}
}

function clearValue() {
	emit('update:modelValue', null);
	nextTick(() => { showPicker.value = false; });
}

function switchMode() {
	if (mode.value == 'date') mode.value = 'month';
	else if (mode.value == 'month') mode.value = 'year';
	else if (mode.value == 'year') mode.value = 'month';
}

function movePage(n) {
	n = Math.sign(n);
	if (mode.value == 'date') {
		month.value += n;
		if (month.value >= 12) {
			month.value = 0;
			++year.value;
		} else if (month.value < 0) {
			month.value = 11;
			--year.value;
		}
	} else if (mode.value == 'month') {
		year.value += n;
	} else if (mode.value == 'year') {
		year.value += n * 12;
	}
}


onMounted(() => {
	let today = dayjs(props.modelValue);
	if (!today.isValid()) today = dayjs();
	
	year.value = today.year();
	month.value = today.month();
	date.value = today.date();
	
	if (props.minLevel) mode.value = props.minLevel;
})



</script>