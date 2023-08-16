import NestedRoutes from '@/layouts/NestedRoutes.vue'
import PartList from './PartList/PartList.vue'
import PartForm from './PartForm/PartForm.vue'
import PartView from './PartView/PartView.vue'

export default [{
	path: '/parts',
	component: NestedRoutes,
	meta: {
		title: 'Part Management',
		scopes: [ 'parts:view', 'parts:edit' ]
	},
	children: [{
		path: '',
		component: PartList,
	}, {
		path: 'new',
		component: PartForm,
		meta: {
			title: 'New Part Creation',
			scopes: [ 'parts:edit' ]
		}
	}, {
		path: 'edit/:partID',
		component: PartForm,
		props: true,
		meta: {
			title: 'Modify Part',
			scopes: [ 'parts:edit' ]
		}
	}, {
		path: 'view/:partID',
		component: PartView,
		props: true,
		meta: {
			title: 'Part Details',
			scopes: [ 'parts:view' ],
		}
	}]
}]
