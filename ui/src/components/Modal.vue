<style scoped>
.modal-container {
	max-height: calc(95vh);
}
.modal-enter-active,
.modal-leave-active  {
	transition: all 0.2s ease;
	.modal-container { transition: all 0.2s ease; }
}
.modal-enter-from, .modal-leave-to {
	opacity: 0;
	.modal-container { transform: scale(1.2); }
}

</style>
<template>
	<transition name="modal">
		<!-- Modal backdrop -->
		<div
			v-if="modelValue"
			@click="$emit('update:modelValue', false)"
			class="bg-black fixed overflow-hidden z-20 inset-0 w-full h-screen flex justify-center items-center bg-opacity-75">
			
			<!-- This is the container for the modal -->
			<div
				@click.stop
				class="modal-container bg-adapt rounded-lg overflow-y-auto"
				:class="ContainerClasses">
				<slot></slot>
			</div>
			
		</div>
	</transition>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true
	},
	containerClass: {
		type: [ String, Array, Object ],
		default: 'px-4 py-3',
	}
});

const ContainerClasses = computed(() => {
	const classes = [ props.containerClass ];
	return classes;
});

</script>