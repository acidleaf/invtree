import NestedRoutes from '@/layouts/NestedRoutes.vue'
import PartList from './PartList/PartList.vue'
import PartForm from './PartForm/PartForm.vue'
import PartView from './PartView/PartView.vue'
import { UserScopes } from '@/utils/enums'


export default [{
	path: '/parts',
	component: NestedRoutes,
	meta: {
		title: 'Part Management',
		scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ]
	},
	children: [{
		path: '',
		component: PartList,
	}, {
		path: 'new',
		component: PartForm,
		meta: {
			title: 'New Part Creation',
			scopes: [ UserScopes.PARTS_EDIT ]
		}
	}, {
		path: 'edit/:partID',
		component: PartForm,
		props: true,
		meta: {
			title: 'Modify Part',
			scopes: [ UserScopes.PARTS_EDIT ]
		}
	}, {
		path: 'view/:partID',
		component: PartView,
		props: true,
		meta: {
			title: 'Part Details',
			scopes: [ UserScopes.PARTS_VIEW ],
		}
	}]
}]
