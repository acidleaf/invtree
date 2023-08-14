import UserScopes from '@/common/UserScopes'

export default [{
	method: 'GET',
	path: '/parts/:partID',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const partID = $req.params.partID;
		const { Part } = $req.db.models;
		
		const part = await Part.findById(partID, '-__v');
		if (!part) return $res.error('invalid_part');
		
		return $res.json(part);
	}
}, {
	// Creates a new item
	method: 'POST',
	path: '/parts',
	scopes: [ UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const { Part } = $req.db.models;
		
		const part = await Part.create({
			company: $req.user.company,
			category: $req.body.category,
			partNum: $req.body.partNum,
			description: $req.body.description,
			formSchema: null,
			active: true,
			created: new Date(),
		});
		
		
		return $res.json(part);
	}
}, {
	// Update item fields
	method: 'PUT',
	path: '/parts/:partID',
	scopes: [ UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const partID = $req.params.partID;
		const { Part } = $req.db.models;
		
		const part = await Part.findById(partID);
		if (!part) return $res.error('invalid_part');
		
		part.category = $req.body.category;
		part.partNum = $req.body.partNum;
		part.description = $req.body.description;
		await part.save();
		
		return $res.json();
	}
}, {
	// Marks item as inactive, but do not delete from system
	method: 'DELETE',
	path: '/parts/:partID',
	scopes: [ UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const partID = $req.params.partID;
		const { Part } = $req.db.models;
		
		const part = await Part.findById(partID);
		if (!part) return $res.error('invalid_part');
		
		part.active = false;
		await part.save();
		
		return $res.json();
	}
}]