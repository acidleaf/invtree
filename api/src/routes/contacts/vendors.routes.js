import PaginationMiddleware from '@/middlewares/PaginationMiddleware'

export default [{
	method: 'GET',
	path: '/vendors',
	scopes: 'auth',
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
		
			return $res.json();
		}
	]
}, {
	method: 'GET',
	path: '/vendors/:vendorID',
	scopes: 'auth',
	async handler($req, $res) {
		const vendorID = $req.params.vendorID;
		
		return $res.json();
	}
}, {
	method: 'POST',
	path: '/vendors',
	scopes: [],
	async handler($req, $res) {
		
		return $res.json();
	}
}, {
	method: 'PUT',
	path: '/vendors/:vendorID',
	scopes: [],
	async handler($req, $res) {
		const vendorID = $req.params.vendorID;
		
		return $res.json();
	}
}, {
	method: 'DELETE',
	path: '/vendors/:vendorID',
	scopes: [],
	async handler($req, $res) {
		const vendorID = $req.params.vendorID;
		
		return $res.json();
	}
}]