<template>
	<div class="sticky top-0 h-10 z-10 bg-dark">
		<div class="flex h-full items-center">
			<div class="absolute md:relative">
				<button
					class="px-2 h-full text-gray hover:text-gray-400 transition-colors"
					@click="showSidebar">
					<icon :data="mdiMenu" class="w-6 h-6" />
				</button>
			</div>
			
			<div class="flex-grow text-white flex items-center justify-center md:justify-start gap-2">
				<icon :data="mdiHelpCircle" class="text-accent" />
				<span class="font-medium tracking-wider">{{ appName }}</span>
			</div>
			
			<div class="absolute right-0 md:relative">
				<button @click="toggleTheme" class="px-2 h-full text-gray hover:text-gray-400 transition-colors">
					<icon :data="mdiWeatherNight" :class="isDarkMode ? 'text-accent' : 'text-gray-600'" class="w-6 h-6 transition-colors" />
				</button>
			</div>
			
		</div>
	</div>
</template>
<script setup>
import { $sidebar } from '@/services'
import { mdiMenu, mdiHelpCircle, mdiWeatherNight } from '@mdi/js'
import { isDarkMode, toggleTheme } from '@/utils/darkMode';

const appName = import.meta.env.VITE_APP_NAME;

function showSidebar() {
	$sidebar.show();
}


</script>