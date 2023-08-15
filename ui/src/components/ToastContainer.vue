<style scoped>
.toast-enter-active,
.toast-leave-active {
	transition: all 0.5s ease;
	position: absolute;
}

.toast-enter-from,
.toast-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
.toast-move { transition: all 0.5s ease; }
</style>
<template>
	<div class="fixed inset-0 pointer-events-none w-full pt-4 md:pt-20 px-2 md:px-0 z-50">
		<transition-group
			name="toast"
			tag="div"
			class="relative w-full md:w-4/5 mx-auto"
			:class="ContainerClass[align]">
			
			<div v-for="t in toasts" :key="t.id" class="w-full mb-2">
				<div class="inline-block mx-auto text-white px-4 py-2 rounded-lg tracking-wide font-medium shadow-lg whitespace-pre-wrap"
					:class="ToastClass[t.level]">{{ t.message }}</div>
			</div>
			
		</transition-group>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { emitter } from '@/utils'

const props = defineProps({
	duration: {
		type: Number,
		default: 2000,
	},
	maxToasts: {
		type: Number,
		default: 10,
	},
	align: {
		type: String,
		default: 'center'
	}
});

const ContainerClass = {
	left: 'text-left',
	right: 'text-right',
	center: 'text-center',
};
const ToastClass = {
	success: 'bg-success',
	error: 'bg-danger',
	warn: 'bg-warn',
	info: 'bg-info',
};



function makeID(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const poolLen = characters.length;
	let result = '';
	for (let i = 0; i < length; ++i) {
		result += characters.charAt(Math.floor(Math.random() * poolLen));
	}
	return result;
};


const toasts = ref([]);
function addToast({ level, message }) {
	const toastID = makeID(10);
	toasts.value.push({
		id: toastID,
		level,
		message,
	});
	
	// Remove earlier toasts if max amount reached
	if (toasts.value.length > props.maxToasts) {
		toasts.value.shift();
	}
	
	// Remove toast after set duration
	setInterval(() => {
		const index = toasts.value.findIndex(t => t.id == toastID);
		if (index >= 0) toasts.value.splice(index, 1);
	}, props.duration);
}

// Subscribe to event
emitter.on('toast/add', addToast);

</script>