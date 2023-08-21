<template>
	<div class="px-2 py-2">
		<preloader v-if="loading" />
		<div v-else>
			
			<table class="table w-full">
				<TableHeader
					v-model:sortKey="sortData.sortKey"
					v-model:sortOrder="sortData.sortOrder"
					@sort="loadPage(0)"
					v-bind="{
						headers,
					}" />
				<tbody>
					<tr v-if="!items.length">
						<td :colspan="headers.length">No records available</td>
					</tr>
					<tr v-for="it in items">
						<td>{{ it.serialNum }}</td>
						<td>{{ it.created }}</td>
					</tr>
				</tbody>
			</table>
			
		</div>
	</div>
</template>
<script setup>
import TableHeader from '@/components/TableHeader.vue'
import { PageData, SortData } from '@/mixins'
import { $api, $toast } from '@/services'
import { computed, onMounted, ref } from 'vue'

const props = defineProps([ 'partID' ]);


const loading = ref(false);
const pageData = PageData();
const sortData = SortData('item.serialNum');
const items = ref([]);


const headers = computed(() => {
	const columns = [
		{ key: 'item.serialNum', label: 'Serial Number', width: '200px' },
	]
	return columns;
});


async function loadPage(page) {
	loading.value = true;
	try {
		const queries = [
			`page=${page}`,
			`limit=${pageData.pageLimit}`,
			`sort=${sortData.sortKey}`,
			`order=${sortData.sortOrder}`,
		];
		
		const res = await $api.request('GET', `parts/${props.partID}/items?${queries.join('&')}`);
		pageData.curPage = page;
		pageData.totalRows = res.total;
		items.value = res.results;
		
	} catch (err) {
		console.error(err);
		$toast.error('Error loading part inventory list');
	}
	loading.value = false;
}

onMounted(() => loadPage(0));

</script>