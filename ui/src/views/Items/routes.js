import NestedRoutes from '@/layouts/NestedRoutes.vue'
import ItemList from './ItemList/ItemList.vue'
import ItemForm from './ItemForm/ItemForm.vue'
import ItemView from './ItemView/ItemView.vue'
import { UserScopes } from '@/utils/enums'

export default [{
	path: '/items',
	component: NestedRoutes,
	meta: {
		title: 'Inventory Management',
		scopes: [ UserScopes.ITEMS_VIEW, UserScopes.ITEMS_EDIT ],
	},
	children: [{
		path: '',
		component: ItemList,
	}, {
		path: 'new/:partID',
		component: ItemForm,
		props: true,
		meta: {
			title: 'New Item Creation',
			scopes: [ UserScopes.ITEMS_EDIT ]
		}
	}, {
		path: 'edit/:itemID',
		component: ItemForm,
		props: true,
		meta: {
			title: 'Modify Item',
			scopes: [ UserScopes.ITEMS_EDIT ]
		}
	}, {
		path: 'view/:itemID',
		component: ItemView,
		props: true,
		meta: {
			title: 'Item Details',
			scopes: [ UserScopes.ITEMS_VIEW, UserScopes.ITEMS_EDIT ]
		}
	}]
}]