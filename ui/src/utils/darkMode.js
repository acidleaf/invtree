import { ref } from 'vue'

export const isDarkMode = ref(false);
export async function loadTheme() {
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	
	// Check if theme is already set
	const theme = localStorage.getItem('theme');
	if (![ 'dark', 'light' ].includes(theme)) {
		theme = prefersDarkMode ? 'dark' : 'light';
	}
	
	if (theme == 'dark') document.documentElement.classList.add('dark');
	else if (theme == 'light') document.documentElement.classList.remove('dark');
	
	isDarkMode.value = theme == 'dark';
}


export async function toggleTheme() {
	isDarkMode.value = !isDarkMode.value;
	
	if (isDarkMode.value) document.documentElement.classList.add('dark');
	else document.documentElement.classList.remove('dark');
	
	localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
}