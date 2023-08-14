import UserScopes from '@/common/UserScopes'


export default [{
	// Fetch all item categories
	method: 'GET',
	path: '/part/categories',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		
		const { PartCategory } = $req.db.models;
		const categories = await PartCategory.find({
				company: $req.user.company
			}, '_id name')
			.sort({ name: 'asc' });
		
		return $res.json(categories);
	}
}, {
	// Create new item category
	method: 'POST',
	path: '/part/categories',
	scopes: [ UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		
		const { PartCategory } = $req.db.models;
		
		const cat = await PartCategory.create({
			company: $req.user.company,
			name: $req.body.name,
		});
		
		return $res.json(cat);
	}
}, {
	// Update category details
	method: 'PUT',
	path: '/part/categories/:catID',
	scopes: [ UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const catID = $req.params.catID;
		
		const cat = await PartCategory.findById(catID);
		if (!cat) return $res.error('invalid_category');
		
		cat.name = $req.body.name;
		await cat.save();
		
		return $res.json();
	}
}, {
	// Delete category
	method: 'DELETE',
	path: '/part/categories/:catID',
	scopes: [ UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const catID = $req.params.catID;
		
		const { Part, PartCategory } = $req.db.models;
		
		// Remove item references
		await Part.updateMany({
			company: $req.user.company,
			category: catID
		}, {
			category: null
		});
				
		// Remove category record
		await PartCategory.deleteOne({ _id: catID });
		
		return $res.json();
	}
}]