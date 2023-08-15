<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<Search v-model="query"
			class="mb-4"
			v-bind="{
				placeholder: 'Search parts',
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
					<tr v-if="!parts.length">
						<td :colspan="headers.length">No records available</td>
					</tr>
					<tr v-for="p in parts" class="border-b border-adapt">
						<td>
							<router-link :to="`/part/view/${p._id}`" class="group">
								<div class="font-medium text-primary group-hover:text-accent">{{ p.partNum }}</div>
								<div class="text-sm text-gray-400">{{ p.description }}</div>
							</router-link>
						</td>
						<td>{{ p.category ? p.category.name : '-' }}</td>
						<td class="text-center">
							<icon :data="p.active ? mdiCheck : mdiClose" />
						</td>
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
import Search from '@/components/Search.vue'
import { $api, $toast } from '@/services'
import { mdiCheck, mdiClose } from '@mdi/js'
import { onMounted, ref } from 'vue'
import { Pagination, PageData, SortData } from '@/mixins'

const headers = [
	{ key: 'partNum', label: 'Part' },
	{ key: 'category.name', label: 'Category', width: '200px' },
	{ key: 'active', label: 'Status', width: '40px', class: 'text-center' },
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

onMounted(() => loadPage(0));

</script>