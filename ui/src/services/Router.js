import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/Auth'

import Home from '@/views/Home/Home.vue'
import NotFoundPage from '@/views/Misc/NotFoundPage.vue'
import LoginRoutes from '@/views/Login/routes'
import MiscRoutes from '@/views/Misc/routes'

import PartRoutes from '@/views/Parts/routes'
import ItemRoutes from '@/views/Items/routes'

const routes = [{
	// Home page
	path: '/',
	alias: '/home',
	component: Home,
},

...LoginRoutes,
...MiscRoutes,

...PartRoutes,
...ItemRoutes,

{
	// Catch all
	path: '/:pathMatch(.*)*',
	component: NotFoundPage,
	meta: {
		scopes: 'public',
		title: 'Not Found'
	}
}];


// Init router
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});


// Route navigation guard to check for valid scopes before allowing users to access
router.beforeEach((to, from, next) => {
	if ((to.meta.scopes === 'public')) return next();
	
	
	const $authStore = useAuthStore();
	
	// If not logged in, redirect to login page
	const authenticated = $authStore.isAuthenticated;
	if (!authenticated) return next('/login');
	
	// If no scopes set, proceed
	if (!to.meta.scopes) return next();
	else {
		let allowed = false;
		
		// Check if scope exists
		const userScopes = $authStore.scopes;
		for (const i in to.meta.scopes) {
			const s = to.meta.scopes[i];
			if (userScopes.includes(s)) {
				allowed = true;
				break;
			}
		}
		
		if (!allowed) return next('/404');
	}
	
	return next();
});


export default router;