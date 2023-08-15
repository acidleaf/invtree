export default [{
	method: 'POST',
	path: '/mock/parts',
	scopes: 'any',
	async handler($req, $res) {
		
		const parts = $req.body;
		
		const { Part } = $req.db.models;
		for (const i in parts) {
			const p = parts[i];
			
			await Part.create({
				company: p.company,
				partNum: p.partNum,
				description: p.description,
				category: p.category,
				active: p.active,
			});
		}
		
		return $res.json();
	}
}]