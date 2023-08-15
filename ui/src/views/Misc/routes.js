import ErrorPage from './ErrorPage.vue'
import ThemePage from './ThemePage.vue'


export default [{
	path: '/error',
	component: ErrorPage,
	meta: {
		scopes: 'public',
		title: 'Error Encountered'
	}
}, {
	path: '/theme',
	component: ThemePage,
	meta: {
		scopes: 'public',
		title: 'Theme Preview'
	}
}]