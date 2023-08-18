<template>
	<render />
</template>
<script setup>
import { h } from 'vue'
import { mdiCircleOutline, mdiCheckboxBlank, mdiCheckboxMarked, mdiCircleSlice8 } from '@mdi/js'
import Icon from '@/components/Icon.vue'

const props = defineProps([ 'schemaField', 'value' ]);

function render() {
	const sf = props.schemaField;
	if (!sf) return h();
	
	if (sf.elementType == 'text') return renderText();
	else if (sf.elementType == 'radio') return renderRadio();
	else if (sf.elementType == 'checkbox') return renderCheckbox();
	else if (sf.elementType == 'textarea') return renderTextarea();
	return h();
}


function renderText() {
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		h('input', {
			class: 'input w-full',
			readonly: true,
			type: sf.inputType || 'text',
			placeholder: sf.placeholder,
			value: props.value,
		})
	]);
}

function renderTextarea() {
	// Similar to renderText
	const sf = props.schemaField;
	return h('div', [
		h('label', { class: 'label' }, [ sf.label ]),
		h('textarea', {
			class: 'input w-full',
			readonly: true,
			placeholder: sf.placeholder,
			value: props.value,
		})
	]);
}


function renderRadio() {
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