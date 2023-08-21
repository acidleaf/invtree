<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
		</div>
		
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import TableHeader from '@/components/TableHeader.vue'
import Search from '@/components/Search.vue'
import { $api, $toast } from '@/services'
import { mdiCheck, mdiClose } from '@mdi/js'
import { onMounted, ref } from 'vue'
import { Pagination, PageData, SortData } from '@/mixins'

const headers = [
	{ key: 'loanNum', label: 'Loan Number' },
	{ key: 'loanDate', label: 'Loan Date', width: '150px' },
	{ key: 'dueDate', label: 'Due Date', width: '150px' },
	{ key: 'returnDate', label: 'Return Date', width: '150px' },
	{ key: 'status', label: 'Status', width: '40px', class: 'text-center' },
];

const loading = ref(false);
const pageData = PageData();
const sortData = SortData('partNum');
const query = ref('');

const parts = ref([]);


async function loadPage(page) {
	loading.value = true;
	try {
		const queries = [
			`page=${page}`,
			`limit=${pageData.pageLimit}`,
			`sort=${sortData.sortKey}`,
			`order=${sortData.sortOrder}`,
		];
		if (query.value) queries.push(`q=${query.value}`)
		
		
		const res = await $api.request('GET', `parts?${queries.join('&')}`);
		pageData.curPage = page;
		pageData.totalRows = res.total;
		parts.value = res.results;
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load page');
	}
	loading.value = false;
}


</script>