<template>
	<!-- Actual image -->
	<img v-if="src" :src="src" class="overflow-hidden object-cover">
	<div v-else class="w-full bg-gray-200 dark:bg-gray-700">
		<slot>
			<div class="h-full flex items-center justify-center text-gray-400 dark:text-gray">
				<icon :data="icon" class="w-1/4 h-1/4" />
			</div>
		</slot>
	</div>
</template>
<script setup>
import { mdiImage } from '@mdi/js'

const props = defineProps({
	src: String,
	icon: {
		type: String,
		default: mdiImage
	}
});


</script>