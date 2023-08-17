import UserScopes from '@/common/UserScopes'

export default [{
	method: 'GET',
	path: '/parts/:partID/items',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const partID = $req.params.partID;
		
		const { Item } = $req.db.models;
		const items = await Item.find({ part: partID });
		
		return $res.json(items);
	}
}]