<style scoped>
.picker-btn {
	@apply hover:text-accent focus:outline-none disabled:pointer-events-none disabled:text-gray-300 dark:disabled:text-gray-700;
}
</style>
<template>
	<div class="mb-2 flex items-center px-2 py-2">
		<button @click="$emit('prev')" class="picker-btn" :disabled="!enablePrev">
			<icon class="w-8 h-8" :data="mdiChevronLeft" />
		</button>
		
		
		<div class="flex-grow text-2xl text-center mx-2 select-none">
			<slot></slot>
		</div>
		
		<button @click="$emit('next')" class="picker-btn" :disabled="!enableNext">
			<icon class="w-8 h-8" :data="mdiChevronRight" />
		</button>
	</div>
</template>
<script setup>
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const props = defineProps([ 'enablePrev', 'enableNext' ]);

</script>