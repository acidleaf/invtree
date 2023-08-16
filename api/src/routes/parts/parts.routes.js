import UserScopes from '@/common/UserScopes'
import PaginationMiddleware from '@/middlewares/PaginationMiddleware'


export default [{
	method: 'GET',
	path: '/parts',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
			const { Part } = $req.db.models;
			
			// Search query
			let $match = {};
			const q = $req.query.q;
			if (q) {
				$match = {
					$or: [
						{ partNum: { $regex: q, $options: 'i' }},
						{ description: { $regex: q, $options: 'i' }}
					]
				};
			}
			
			// Sort query
			let $sort = { 'part.partNum': 1 };
			if ($req.query.sort) {
				const order = $req.query.order ? parseInt($req.query.order) : 1;
				$sort = { [$req.query.sort]: order };
			}
			
			
			// Aggregation pipeline for part search
			const parts = await Part.aggregate([
				{ $match },
				{ $lookup: {
					from: 'part_categories',
					localField: 'category',
					foreignField: '_id',
					as: 'category',
				}},
				{ $unwind: '$category' },
				{ $sort },
				{ $skip: $req.pagination.skip },
				{ $limit: $req.pagination.limit },
				
				{ $unset: ['__v', 'company', 'category.__v', 'category.company' ]},
			]);
			
			// Count total with match condition
			const total = await Part.count($match);
			
			return $res.json({
				total,
				results: parts,
			});
		}
	]
}, {
	// Fetch part details
	method: 'GET',
	path: '/parts/:partID',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	async handler($req, $res) {
		const partID = $req.params.partID;
		const { Part } = $req.db.models;
		
		let part = await Part.findById(partID, '-__v');
		if (!part || part.company != $req.user.company) return $res.error('invalid_part');
		
		
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
		const { Part, FormSchema } = $req.db.models;
		
		const part = await Part.findById(partID);
		if (!part) return $res.error('invalid_part');
		
		// Basic fields
		part.category = $req.body.category;
		part.partNum = $req.body.partNum;
		part.description = $req.body.description;
		
		// Form schema fields
		if (part.formSchema) {
			// Fetch schema
			const schema = await FormSchema.findById(part.formSchema).lean();
			
			// Update extended data fields
			const extendedData = $req.body.extended || {};
			for (const i in schema.fields) {
				if (extendedData[i] !== undefined) part.extended.set(i, extendedData[i]);
				else part.extended.set(i, schema.fields[i].default || null);
			}
		}
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