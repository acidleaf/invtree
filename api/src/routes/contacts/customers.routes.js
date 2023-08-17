import PaginationMiddleware from '@/middlewares/PaginationMiddleware'

export default [{
	method: 'GET',
	path: '/customers',
	scopes: 'auth',
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
		
			return $res.json();
		}
	]
}, {
	method: 'GET',
	path: '/customers/:customerID',
	scopes: 'auth',
	async handler($req, $res) {
		const customerID = $req.params.customerID;
		
		return $res.json();
	}
}, {
	method: 'POST',
	path: '/customers',
	scopes: [],
	async handler($req, $res) {
		
		return $res.json();
	}
}, {
	method: 'PUT',
	path: '/customers/:customerID',
	scopes: [],
	async handler($req, $res) {
		const customerID = $req.params.customerID;
		
		return $res.json();
	}
}, {
	method: 'DELETE',
	path: '/customers/:customerID',
	scopes: [],
	async handler($req, $res) {
		const customerID = $req.params.customerID;
		
		return $res.json();
	}
}]