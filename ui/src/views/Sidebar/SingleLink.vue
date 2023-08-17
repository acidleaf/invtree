<template>
	<div class="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors px-3 py-2 select-none cursor-pointer font-medium" @click="navigatePath(path)">
		<icon v-if="icon" :data="icon" />
		<div>{{ label }}</div>
	</div>
</template>
<script setup>
import { $sidebar } from '@/services'
import { useRouter } from 'vue-router'

const props = defineProps([ 'icon', 'label', 'path' ]);
const $router = useRouter();

function navigatePath(path) {
	$router.push(path);
	$sidebar.hide();
}

</script>