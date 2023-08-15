<style scoped>

.modal-container {
	height: 95vh;
	@apply absolute bottom-0;
}


.modal-enter-active, .modal-leave-active  {
	transition: all 0.3s ease;
	.modal-container { transition: all 0.3s ease; }
}
.modal-enter-from, .modal-leave-to {
	opacity: 0;
	.modal-container { transform: translateY(100%); }
}

.modal-enter-to, .modal-leave-from {
	opacity: 1;
	.modal-container { transform: translateY(0%); }
}

</style>
<template>
	<transition name="modal">
		<!-- Modal overlay -->
		<div
			v-if="modelValue"
			@click="$emit('update:modelValue', false)"
			class="bg-black fixed inset-0 overflow-hidden z-20 w-screen h-screen flex justify-center items-center bg-opacity-75">
			
			<!-- This is the container for the modal -->
			<div
				@click.stop
				class="modal-container bg-adapt w-full lg:w-4/5 rounded-t-lg overflow-y-auto">
				<slot></slot>
			</div>
			
		</div>
	</transition>
</template>
<script setup>

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

</script>