import { computed } from 'vue'
import {
	mdiViewDashboard,
	mdiAccountMultiple,
	mdiCalendar,
	mdiSchool,
	mdiBook,
	mdiBookOpenVariant,
	mdiAccount,
	mdiScrewdriver,
} from '@mdi/js'
import { useAuthStore } from '@/store/Auth'
import { UserScopes } from '@/utils/enums'



const baseLinks = [{
	// Homepage
	icon: mdiViewDashboard,
	path: '/',
	label: 'Dashboard'
}, {
	// User Profile
	icon: mdiAccount,
	label: 'User Profile',
	path: '/profile'
}, {
	icon: mdiScrewdriver,
	label: 'Parts',
	links: [{
		label: 'Part Management',
		path: '/parts',
		scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ]
	}, {
		label: 'New Part Creation',
		path: '/parts/new',
		scopes: [ UserScopes.PARTS_EDIT ]
	}]
}];



function isVisible(singleLink, userScopes) {
	if (!singleLink.scopes) return true;
	
	for (const i in userScopes) {
		const s = userScopes[i];
		if (singleLink.scopes.indexOf(s) >= 0) return true;
	}
	return false;
}

const displayedLinks = computed(() => {
	const $authStore = useAuthStore();
	const userScopes = $authStore.scopes;
	
	// Resolve links accessible by the user
	const links = [];
	for (const i in baseLinks) {
		const link = baseLinks[i];
		if (link.path) {
			// Single link
			if (isVisible(link, userScopes)) links.push({
				icon: link.icon,
				label: link.label,
				path: link.path,
			});
			
		} else {
			
			// Check for top level scopes
			if (link.scopes) {
				let hasScope = false;
				for (const i in userScopes) {
					const s = userScopes[i];
					if (link.scopes.indexOf(s) >= 0) {
						hasScope = true;
						break;
					}
				}
				if (!hasScope) continue;
			}
			
			
			// Determine which child links are visible
			const childLinks = [];
			for (const j in link.links) {
				const childLink = link.links[j];
				if (isVisible(childLink, userScopes)) {
					childLinks.push({
						label: childLink.label,
						path: childLink.path,
					});
				}
			}
			
			
			// Create multi-link only if child links are present
			if (childLinks.length > 0) {
				links.push({
					icon: link.icon,
					label: link.label,
					links: childLinks,
					multi: true,
				});
			}
		}
	}
	return links;
});

export default displayedLinks;