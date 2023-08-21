import UserScopes from '@/common/UserScopes'
import PaginationMiddleware from '@/middlewares/PaginationMiddleware'

export default [{
	method: 'GET',
	path: '/loans',
	scopes: [ UserScopes.LOANS_VIEW, UserScopes.LOANS_EDIT ],
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
		
			return $res.json();
		}
	]
}, {
	method: 'GET',
	path: '/loans/:loanID',
	scopes: [ UserScopes.LOANS_VIEW, UserScopes.LOANS_EDIT ],
	async handler($req, $res) {
		const loanID = $req.params.loanID;
		
		return $res.json();
	}
}, {
	method: 'POST',
	path: '/loans',
	scopes: [ UserScopes.LOANS_EDIT ],
	async handler($req, $res) {
		
		return $res.json();
	}
}, {
	method: 'PUT',
	path: '/loans/:loanID',
	scopes: [ UserScopes.LOANS_EDIT ],
	async handler($req, $res) {
		const loanID = $req.params.loanID;
		
		return $res.json();
	}
}, {
	method: 'DELETE',
	path: '/loans/:loanID',
	scopes: [ UserScopes.LOANS_EDIT ],
	async handler($req, $res) {
		const loanID = $req.params.loanID;
		
		return $res.json();
	}
}]