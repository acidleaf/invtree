<style scoped>
.sidebar-enter-active, .sidebar-leave-active {
	transition: all 0.2s ease;
	.sidebar-container { transition: all 0.2s ease; }
}

.sidebar-enter-from, .sidebar-leave-to {
	opacity: 0;
	.sidebar-container { transform: translateX(-100%); }	
}

.sidebar-enter-to, .sidebar-leave-from {
	opacity: 1;
	.sidebar-container { transform: translateX(0%); }
}


</style>
<template>
	<transition name="sidebar">
		<!-- Cover -->
		<div v-if="shown" @click="shown = false" class="bg-black fixed z-20 inset-0 w-full h-full bg-opacity-75">
			
			<!-- Sidebar wrapper -->
			<div @click.stop class="sidebar-container max-w-[300px] left-0 h-full inset-y-0 bg-white dark:bg-dark dark:text-gray-300 w-4/5">
				<slot></slot>
			</div>
			
		</div>
	</transition>
</template>
<script setup>
import { emitter } from '@/utils'
import { ref } from 'vue'


const shown = ref(false);
emitter.on('sidebar/show', () => { shown.value = true; });
emitter.on('sidebar/hide', () => { shown.value = false; });
emitter.on('sidebar/toggle', () => { shown.value = !shown.value; });

</script>