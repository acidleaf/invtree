<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<Search v-model="query"
			class="mb-4"
			v-bind="{
				placeholder: 'Search items',
				inputClass: 'w-full',
				loading,
			}"
			@search="loadPage(0)"
			@clear="loadPage(0)" />
		
		<preloader v-if="loading" />
		<div v-else>
			<table class="table w-full">
				<TableHeader
					class="border-b border-adapt"
					v-model:sortKey="sortData.sortKey"
					v-model:sortOrder="sortData.sortOrder"
					@sort="loadPage(0)"
					v-bind="{
						headers,
					}" />
					
				<tbody>
					<tr v-if="!items.length" class="border-b border-adapt">
						<td :colspan="headers.length">No items available</td>
					</tr>
					
					<tr v-for="it in items" class="border-b border-adapt group hover:bg-gray-100 dark:hover:bg-gray-800">
						<td>
							<router-link :to="`/items/view/${it._id}`" class="block font-medium text-primary hover:text-accent">{{ it.serialNum }}</router-link>
							
						</td>
						<td>
							<div class="font-medium text-sm">{{ it.part.partNum }}</div>
							<div class="text-sm text-gray-400">{{ it.part.description }}</div>
						</td>
						<td>{{ it.category ? it.category.name : '-' }}</td>
						<td>{{ it.loan ? 'LOAN' : '-' }}</td>
					</tr>
				</tbody>
			</table>
			
			<Pagination class="mt-4" v-bind="pageData" @goto="loadPage" />
		</div>
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import TableHeader from '@/components/TableHeader.vue'
import { onMounted, ref } from 'vue'
import { PageData, Pagination, SortData } from '@/mixins'
import { $api, $toast } from '@/services'
import Search from '@/components/Search.vue'

const loading = ref(false);
const pageData = PageData();
const sortData = SortData('serialNum');
const items = ref([]);
const query = ref('');

const headers = [
	{ key: 'serialNum', label: 'Serial Num', width: '200px' },
	{ key: 'part.partNum', label: 'Part Num' },
	{ key: 'part.category.name', label: 'Category', width: '200px' },
	{ key: 'loan.label', label: 'Loan', width: '200px' },
];

async function loadPage(page) {
	loading.value = true;
	try {
		const queries = [
			`page=${page}`,
			`limit=${pageData.pageLimit}`,
		];
		if (query.value) queries.push(`q=${query.value}`);
		
		const res = await $api.request('GET', `items?${queries.join('&')}`);
		items.value = res.results;
		pageData.totalRows = res.total;
		
		
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to load items');
	}
	loading.value = false;
}


onMounted(() => loadPage(0));


</script>