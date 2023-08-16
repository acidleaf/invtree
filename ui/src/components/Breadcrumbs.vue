<template>
	<div class="lg:w-4/5 lg:mx-auto lg:px-0 px-2 py-2">
		
		<render />
		
	</div>
</template>
<script setup>
import { mdiChevronRight } from '@mdi/js'
import { computed, h } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Icon from './Icon.vue'

const $route = useRoute();

function crumbLink(path, label) {
	return h(RouterLink, {
		class: 'text-primary-400 hover:text-primary',
		to: path,
	}, () => [ label ]);
}

function separator() {
	return h(Icon, { data: mdiChevronRight, class: 'h-5 text-gray-300' });
}

function render() {
	const crumbs = [
		{ path: '/', label: 'Home' },
	];
	
	
	
	const routeParams = $route.params;
	for (let i = 0; i < $route.matched.length; ++i) {
		const r = $route.matched[i];
		if (!r.meta.title) continue;
		
		// Rebuild path segments to get the link, replacing param segments with routeParam values
		const pathSegments = r.path.split('/');
		for (const i in pathSegments) {
			let seg = pathSegments[i];
			if (seg.startsWith(':')) {
				seg = seg.slice(1);
				if (routeParams[seg]) pathSegments[i] = routeParams[seg];
			}
		}
		crumbs.push({ path: pathSegments.join('/'), label: r.meta.title });
	}
	
	const components = [];
	for (const i in crumbs) {
		const c = crumbs[i];
		if (i < crumbs.length - 1) {
			components.push(crumbLink(c.path, c.label));
			components.push(separator());
		} else {
			components.push(h('div', { class: 'text-accent' }, [ c.label ]));
		}
	}
	
	return h('div', { class: 'select-none font-medium flex items-end gap-1' }, components);
	
}


</script>