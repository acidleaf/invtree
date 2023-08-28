<template>
	<render />
</template>
<script setup>
import { h } from 'vue'
import { mdiCircleOutline, mdiCheckboxBlank, mdiCheckboxMarked, mdiCircleSlice8 } from '@mdi/js'
import Icon from '@/components/Icon.vue'

const props = defineProps([ 'schemaField', 'modelValue', 'value' ]);
const $emit = defineEmits([ 'update:modelValue' ]);

function render() {
	const sf = props.schemaField;
	if (!sf) return h();
	
	if (props.modelValue !== undefined) {
		// Render editable if using v-model
		if (sf.elementType == 'text') return renderText();
		else if (sf.elementType == 'radio') return renderRadio();
		else if (sf.elementType == 'checkbox') return renderCheckbox();
		else if (sf.elementType == 'textarea') return renderTextarea();
	} else if (props.value !== undefined) {
		// Render readonly if using :value
		if (sf.elementType == 'text') return renderTextView();
		else if (sf.elementType == 'radio') return renderRadioView();
		else if (sf.elementType == 'checkbox') return renderCheckboxView();
		else if (sf.elementType == 'textarea') return renderTextareaView();
	}
	
	return h('div');
}


function renderText() {
	/*
	<div>
		<label class="label">{{ schemaField.label }}</label>
		<input
			class="input w-full"
			:type="schemaField.inputType || 'text'"
			:value="modelValue"
			:placeholder="schemaField.placeholder">
	</div>
	*/
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		h('input', {
			class: 'input w-full',
			type: sf.inputType || 'text',
			placeholder: sf.placeholder,
			value: props.modelValue,
			onInput: ev => $emit('update:modelValue', ev.target.value),
		})
	]);
}
function renderTextView() {
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		h('div', {
			class: 'input w-full whitespace-pre-wrap',
		}, [ props.value ])
	]);
}




function renderTextarea() {
	// Similar to renderText
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		h('textarea', {
			class: 'input w-full',
			placeholder: sf.placeholder,
			value: props.modelValue,
			onInput: ev => {
				$emit('update:modelValue', ev.target.value);
			}
		})
	]);
}
function renderTextareaView() {
	// Similar to renderText
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		h('div', {
			class: 'input w-full whitespace-pre-wrap',
		}, [ props.value ])
	]);
}



function renderRadio() {
	/*
	<!-- Output template for reference -->
	<div v-if="schemaField.elementType == 'radio'">
		<label class="label">{{ schemaField.label }}</label>
		<div v-for="c in schemaField.choices">
			<label class="input-choice">
				<input type="radio" :value="c.key" v-model="radioInput">
				<span class="font-medium ml-2">{{ c.value }}</span>
			</label>
		</div>
	</div>
	*/
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		...sf.choices.map(c => {
			return h('div', [
				h('label', { class: 'input-choice' }, [
					h('input', {
						type: 'radio',
						value: c.key,
						key: c.key,
						checked: props.modelValue == c.key,
						onInput: ev => $emit('update:modelValue', ev.target.value),
					}),
					h('span', { class: 'font-medium ml-2' }, [ c.value ]),
				])
			]);
		}),
	]);
}
function renderRadioView() {
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		...sf.choices.map(c => {
			const checked = props.value == c.key;
			return h('div', [
				h('label', { class: 'inline-flex items-center select-none' }, [
					h(Icon, {
						data: checked ? mdiCircleSlice8 : mdiCircleOutline,
						class: checked ? `text-accent` : '',
					}),
					h('span', { class: 'font-medium ml-2' }, [ c.value ]),
				])
			]);
		}),
	]);
}





function renderCheckbox() {
	/*
	<label class="input-choice">
		<input type="checkbox" :value="modelValue" v-model="checkboxInput">
		<span class="font-medium ml-2">{{ schemaField.label }}</span>
	</label>
	*/
	const sf = props.schemaField;
	return h('label', { class: 'input-choice' }, [
		h('input', {
			type: 'checkbox',
			checked: props.modelValue ? true : false,
			onInput: ev => {
				$emit('update:modelValue', props.modelValue ? false : true);
			}
		}),
		h('span', { class: 'font-medium ml-2' }, [ sf.label ]),
	]);
}
function renderCheckboxView() {
	const sf = props.schemaField;
	return h('label', { class: 'inline-flex items-center select-none' }, [
		h(Icon, {
			data: props.value ? mdiCheckboxMarked : mdiCheckboxBlank,
			class: props.value ? `text-accent` : '',
		}),
		h('span', { class: 'font-medium ml-2' }, [ sf.label ]),
	]);
}


</script>