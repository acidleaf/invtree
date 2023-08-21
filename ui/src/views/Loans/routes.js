import NestedRoutes from '@/layouts/NestedRoutes.vue'
import LoanList from './LoanList/LoanList.vue'
import LoanForm from './LoanForm/LoanForm.vue'
import { UserScopes } from '@/utils/enums'

export default [{
	path: '/loans',
	component: NestedRoutes,
	meta: {
		title: 'Loan Records',
		scopes: [ UserScopes.LOANS_VIEW, UserScopes.LOANS_EDIT ]
	},
	children: [{
		path: '',
		component: LoanList,
	}, {
		path: 'new',
		component: LoanForm,
		meta: {
			title: 'New Loan Entry',
			scopes: [ UserScopes.LOANS_EDIT ]
		}
	}, {
		path: 'edit/:loanID',
		component: LoanForm,
		props: true,
		meta: {
			title: 'Modify Loan',
			scopes: [ UserScopes.LOANS_EDIT ]
		}
	}]
}]
