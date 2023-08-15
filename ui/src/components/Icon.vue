<template>
	<svg class="inline-block fill-current overflow-hidden w-5 h-5" :viewBox="viewbox">
		<path :d="data"></path>
	</svg>
</template>

<script setup>
const props = defineProps({
	data: String,
	viewbox: {
		type: String,
		default: '0 0 24 24'
	}
});
</script>
