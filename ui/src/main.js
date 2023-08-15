import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import $router from '@/services/Router'
import { useAuthStore } from '@/store/Auth'
import '@/styles/main.css'
import Plugins from '@/plugins'



// Entry point
(async function() {
	// Create app instance
	const app = createApp(App);
	
	// Init store first
	const pinia = createPinia();
	app.use(pinia);
	
	// Init plugins
	await Plugins.init(app);
	
	
	// Refresh session
	const authStore = useAuthStore();
	await authStore.refresh();
	
	
	// Mount app
	app.use($router).mount('#app')
})();