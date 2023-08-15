<template>
	<div>
		<div @click="toggle"><slot name="header" v-bind="{ expanded, close }"></slot></div>
		
		<transition :name="forceClose ? '' : 'accordion'"
			@before-enter="beforeEnter" @enter="enter"
			@before-leave="beforeLeave" @leave="leave">
			
			<div v-if="!forceClose && expanded" class="overflow-hidden duration-100">
				<slot v-bind="{ expanded, close }"></slot>
			</div>
			
		</transition>
		
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'


const props = defineProps([ 'forceClose', 'defaultExpanded' ]);
const expanded = ref(false);

function toggle() { expanded.value = !expanded.value; };
function close() { expanded.value = false; };

onMounted(() => {
	if (props.defaultExpanded) expanded.value = true;
});

// Transition methods
function beforeEnter(el) { el.style.height = '0'; }
function enter(el) { el.style.height = el.scrollHeight + 'px'; }
function beforeLeave(el) { el.style.height = el.scrollHeight + 'px'; }
function leave(el) { el.style.height = '0'; }


</script>