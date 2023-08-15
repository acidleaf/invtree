<style scoped>
.pagination-link {
	min-width: 2rem;
	@apply px-2 py-1 inline-block text-center select-none border text-gray dark:text-gray-400 border-gray-300 dark:border-gray-700 font-semibold transition-colors;
	&:not(:first-child) { @apply -ml-px; }
	&:hover { @apply bg-gray-200 dark:bg-gray-700; }
	&:active { @apply bg-gray-300 dark:bg-gray-600; }
	&:focus { @apply outline-none; }
	
	&.active {
		@apply bg-accent hover:bg-accent border-accent text-white cursor-default;
	}
	
	&.disabled {
		@apply pointer-events-none text-gray-400 dark:text-gray-700 border-gray-300 dark:border-gray-700;
	}
}
</style>
<template>
	<div class="md:flex md:items-center md:justify-between text-center">
		<!-- Number of results -->
		<div v-if="totalRows > 0" class="px-2 mb-2 md:mb-0">
			<div class="font-medium text-gray">Showing {{ recordStart }} to {{ recordEnd }} of {{ totalRows }} results</div>
		</div>
		
		
		<!-- Page links -->
		<div v-if="numPages > 1">
			<button
				v-for="(l, li) in pageLinks"
				:key="li"
				@click="linkClicked(l)"
				class="pagination-link"
				:class="l.classes">
				{{ l.title }}
			</button>
		</div>
		
	</div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
	curPage: {
		type: Number,
		required: true
	},
	numLinks: {
		type: Number,
		default: 2
	},
	
	totalRows: Number,
	pageLimit: Number,
});

const emit = defineEmits([ 'goto' ]);

const numPages = computed(() => {
	const pageLimit = props.pageLimit || 1;
	return Math.ceil(props.totalRows / pageLimit);
});

const rowOffset = computed(() => {
	if (!props.totalRows) return 0;
	return props.curPage * props.pageLimit;
});
const recordStart = computed(() => {
	if (!props.totalRows) return 0;
	return rowOffset.value + 1;
});
const recordEnd = computed(() => {
	return Math.min(props.pageLimit * (props.curPage + 1), props.totalRows);
});


const pageLinks = computed(() => {
	const curPage = props.curPage;
	const numLinks = props.numLinks;
	
	let links = [];
	
	// First page
	links.push({
		title: 'First',
		goto: 0,
		classes: [],
		disabled: curPage == 0,
	});
	
	// Previous link
	links.push({
		title: 'Previous',
		goto: curPage - 1,
		classes: [],
		disabled: curPage == 0
	});
	
	// Before
	for (let i = curPage - numLinks; i < curPage; ++i) {
		if (i < 0) continue;
		links.push({
			title: i + 1,
			goto: i,
			classes: [],
		});
	}
	
	// Current page
	links.push({
		title: curPage + 1,
		goto: curPage,
		classes: [ 'active' ],
	});
	
	// After
	for (let i = 1; i <= numLinks; ++i) {
		if (curPage + i >= numPages.value) break;
		links.push({
			title: curPage + i + 1,
			goto: curPage + i,
			classes: [],
		});
	}
	
	// Next link
	links.push({
		title: 'Next',
		goto: curPage + 1,
		classes: [],
		disabled: curPage == numPages.value - 1
	});
	
	
	// Last page
	links.push({
		title: 'Last',
		goto: numPages.value - 1,
		classes: [],
		disabled: curPage == numPages.value - 1
	});
	
	
	// Set link classes
	links.forEach((link, li) => {
		if (li == 0) link.classes.push('rounded-l');
		else if (li == links.length - 1) link.classes.push('rounded-r');
		
		if (link.disabled) link.classes.push('disabled');
	});
	
	return links;
});

function linkClicked(link) {
	if (link.goto == props.curPage) return;
	emit('goto', link.goto);
}
</script>