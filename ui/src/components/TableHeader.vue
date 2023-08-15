<template>
	<thead>
		<tr>
			<th v-for="h in headers"
				@click="onSelect"
				:width="h.width"
				:class="h.class">
				
				<div class="inline-flex items-center cursor-pointer select-none" @click="sortBy(h)">
					<div>{{ h.label }}</div>
					<icon v-if="h.key == sortKey" :data="showIcon(h.key)" />
				</div>
			</th>
		</tr>
	</thead>
</template>
<script setup>
import { mdiMenuUp, mdiMenuDown } from '@mdi/js'

const props = defineProps({
	headers: Array,
	sortKey: String,
	sortOrder: {
		type: Number,
		default: 1
	}
});

const $emit = defineEmits([
	'sort',
	'update:sortKey',
	'update:sortOrder',
]);

function showIcon() {
	if (props.sortOrder == 1) return mdiMenuUp;
	else if (props.sortOrder == -1) return mdiMenuDown;
}

function sortBy(h) {
	if (h.ignore) return;
	
	if (props.sortKey != h.key) {
		// Switch sort key
		$emit('update:sortKey', h.key);
		$emit('update:sortOrder', 1);
	} else {
		$emit('update:sortOrder', props.sortOrder * -1);
	}
	
	$emit('sort', h.key, props.sortOrder);
}





</script>