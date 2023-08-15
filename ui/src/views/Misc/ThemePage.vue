<template>
	<Container>
		
		<div class="py-2">
			<div class="text-3xl font-semibold">{{ title }}</div>
			<hr>
			<div class="mb-4">{{ content }}</div>
			
			
			<div class="mb-4">
				<div class="text-xl font-medium">Buttons</div>
				<hr>
				<div class="space-y-2">
					<div v-for="btn, key in buttons" :key="key" class="flex items-baseline gap-2">
						<button class="btn w-32" :class="key">{{ btn }}</button>
						<button class="btn w-32 loading" :class="key">{{ btn }}</button>
						<button class="btn w-32" :class="key" disabled>Disabled</button>
						<button class="btn w-32 sm" :class="key">Small</button>
					</div>
				</div>
			</div>
			
			
			<div class="mb-4">
				<div class="text-xl font-medium">Input</div>
				<hr>
				<div class="space-y-4">
					<input type="text" class="input w-full" placeholder="Normal input with placeholder">
					<input type="text" class="input w-full sm" value="Small input">
					<input type="text" class="input w-full" disabled value="Disabled input">
					
					<div>
						<label class="label">Input label</label>
						<input type="text" class="input w-full" value="Input with label">
					</div>
					
					<div>
						<label class="label">Selection Input</label>
						<select class="input w-full">
							<option disabled>Select an option</option>
							<option>Option 1</option>
							<option>Option 2</option>
							<option>Option 3</option>
						</select>
					</div>
					
					<div>
						<label class="label">Checkboxes</label>
						<div class="flex gap-2 px-2">
							<label v-for="i in 3" :key="i" class="input-choice w-32 gap-2">
								<input type="checkbox">
								<span class="font-medium">Checkbox {{ i }}</span>
							</label>
						</div>
					</div>
					
					<div>
						<label class="label">Radio Buttons</label>
						<div class="flex gap-2 px-2">
							<label v-for="i in 3" :key="i" class="input-choice w-32 gap-2">
								<input type="radio" name="radio">
								<span class="font-medium" :value="i">Radio {{ i }}</span>
							</label>
						</div>
					</div>
					
					
					<div>
						<label class="label">Textarea</label>
						<textarea class="input w-full" placeholder="Large text area"></textarea>
					</div>
				</div>
				
			</div>	
			
			
			<div class="mb-4">
				<div class="text-xl font-medium mb-2">Pagination</div>
				<hr>
				<Pagination v-bind="{ curPage, totalRows: 1000, pageLimit: 20 }" @goto="loadPage" />
			</div>
			
			<div>
				<div class="text-xl font-medium mb-2">Tab Bar</div>
				<hr>
				<TabBar v-model="activeTab" v-bind="{ tabs }" />
				<transition name="fade" mode="out-in">
					<div class="p-4" :key="activeTab">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias numquam blanditiis commodi veniam minus dolore soluta ratione quos, animi nesciunt, error aspernatur repellat sapiente incidunt odio ab maxime expedita saepe ipsum? Doloremque consectetur officiis aliquid recusandae natus asperiores sequi nemo!
					</div>
				</transition>
			</div>
			
		</div>
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import Pagination from '@/components/Pagination.vue'
import TabBar from '@/components/TabBar.vue'
import { ref, watch, onMounted } from 'vue'


const title = 'Page Title';
const content = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius provident deleniti pariatur, adipisci obcaecati quasi iure nihil voluptatibus? Itaque doloribus quis soluta earum cupiditate placeat laborum magnam voluptate tempore.';

const buttons = {
	'': 'Default',
	primary: 'Primary',
	accent: 'Accent',
	success: 'Success',
	info: 'Info',
	warn: 'Warn',
	danger: 'Danger',
};


// Theme switching
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = ref('light');
watch(theme, (n, o) => {
	if ((prefersDarkMode && n == '') || n == 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
});


// Pagination
const curPage = ref(0);
function loadPage(page) {
	curPage.value = page;
}


// Tabs
const activeTab = ref('tab1');
const tabs = {
	tab1: 'Tab 1',
	tab2: 'Tab 2',
	tab3: 'Tab 3',
};


</script>