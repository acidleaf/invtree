import UserScopes from '@/common/UserScopes'

export default [{
	method: 'POST',
	path: '/companies',
	scopes: [ UserScopes.COMPANY_EDIT ],
	async handler($req, $res) {
		
		return $res.json();
	}
}]