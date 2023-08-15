<template>
	<Modal v-model="shown" containerClass="px-3 py-2 mx-4 w-full md:w-3/5">
		<!-- Title -->
		<div class="md:text-2xl text-xl font-semibold">{{ title }}</div>
		
		<!-- Message -->
		<div class="text-gray font-medium mt-3 mb-6">
			<div class="whitespace-pre-wrap">{{ message }}</div>
		</div>
		
		<!-- Buttons -->
		<div class="flex items-center gap-2 justify-end">
			<button
				v-for="b, bi in buttons" :key="bi"
				@click="close(b.value)"
				:class="b.btnClass"
				class="btn">
				{{ b.label }}
			</button>
		</div>
		
	</Modal>
</template>
<script setup>
import Modal from '@/components/Modal.vue';
import { emitter } from '@/utils';
import { ref } from 'vue';


const shown = ref(false);
const title = ref('');
const message = ref('');
const buttons = ref([]);
const callback = ref(null);

const buttonPresets = {
	// Single OK button
	OK: [{ label: 'OK', btnClass: 'accent', value: true },],
	
	// OK and cancel button
	OK_CANCEL: [
		{ label: 'OK', btnClass: 'accent', value: true },
		{ label: 'Cancel', btnClass: 'primary', value: false }
	],
	
	// Same as OK_CANCEL, but with Submit instead of OK
	// Used for form submission confirmation
	SUBMIT_CANCEL: [
		{ label: 'Submit', btnClass: 'accent', value: true },
		{ label: 'Cancel', btnClass: 'primary', value: false }
	],
	
	// Yes/no button with success and danger class
	YES_NO: [
		{ label: 'Yes', btnClass: 'accent', value: true },
		{ label: 'No', btnClass: 'primary', value: false },
	],
}

function open(options) {
	shown.value = true;
	
	title.value = options.title;
	message.value = options.message;
	if (!options.buttons) options.buttons = 'OK';
	
	if (typeof options.buttons == 'string') {
		// It's a preset
		const preset = buttonPresets[options.buttons];
		if (preset === undefined) throw new Error('Invalid button preset');
		
		// Assign preset
		buttons.value = preset;
		
	} else {
		// Customizable buttons!
		buttons.value = options.buttons;
	}
	
	
	callback.value = options.callback;
}

// Close the dialog with response
function close(res) {
	if (callback.value) callback.value(res);
	shown.value = false;
}

// Open on event
emitter.on('confirm-dialog/open', open);

</script>