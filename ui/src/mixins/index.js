import { reactive } from 'vue'


export function PageData() {
	return reactive({
		curPage: 0,
		totalRows: 0,
		pageLimit: 25,
	});
}

export function SortData(sortKey, sortOrder = 1) {
	return reactive({
		sortKey,
		sortOrder,
	});
}

export function SearchData() {
	return reactive({
		query: '',
		searching: false,
	});
}

export { default as Pagination } from '@/components/Pagination.vue'