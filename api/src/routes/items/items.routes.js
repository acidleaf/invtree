import UserScopes from '@/common/UserScopes'

export default [{
	method: 'GET',
	path: '/items/:itemID',
	scopes: [ UserScopes.ITEMS_VIEW, UserScopes.ITEMS_EDIT ],
	async handler($req, $res) {
		const itemID = $req.params.itemID;
		
		const { Item } = $req.db.models;
		const item = await Item.findById(itemID);
		if (!item) return $res.error('invalid_item');
		
		// Fetch part details
		await item.populate('part');
		
		
		return $res.json();
	}
}, {
	// Create new item record
	method: 'POST',
	path: '/items',
	scopes: [ UserScopes.ITEMS_EDIT ],
	async handler($req, $res) {
		const { Part, Item } = $req.db.models;
		
		const part = await Part.findById($req.body.partID);
		if (!part || !part.active) return $res.error('invalid_part');
		
		const item = await Item.create({
			company: $req.user.company,
			part: part._id,
			
			serialNum: $req.body.serialNum,
			status: 'active',
			active: true,
			created: new Date(),
			updated: new Date(),
		});
		
		return $res.json(item);
	}
}, {
	// Update item properties
	method: 'PUT',
	path: '/items/:itemID',
	scopes: [ UserScopes.ITEMS_EDIT ],
	async handler($req, $res) {
		const { Item, Part } = $req.db.models;
		
		const item = await Item.findById(itemID);
		if (!item || !item.active) return $res.error('invalid_item');
		
		const part = await Part.findById($req.body.partID);
		if (!part || !part.active) return $res.error('invalid_part');
		
		// Update item fields
		item.part = part._id;
		item.serialNum = $req.body.serialNum;
		item.status = $req.body.status;
		await item.save();
		
		
		return $res.json();
	}
}, {
	// Mark item as inactive
	method: 'DELETE',
	path: '/items/:itemID',
	scopes: [ UserScopes.ITEMS_EDIT ],
	async handler($req, $res) {
		const itemID = $req.params.itemID;
		
		const item = await Item.findById(itemID);
		if (!item || !item.active) return $res.error('invalid_item');
		
		// TODO: Check if item is in any loans
		// ...
		
		
		// Inactive item
		item.active = false;
		await item.save();
		
		return $res.json();
	}
}]