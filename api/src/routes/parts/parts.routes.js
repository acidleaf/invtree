import UserScopes from '@/common/UserScopes'
import PaginationMiddleware from '@/middlewares/PaginationMiddleware'
import { Types } from 'mongoose'


export default [{
	method: 'GET',
	path: '/parts',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
			const { Part } = $req.db.models;
			
			// Search query
			const companyID = new Types.ObjectId($req.user.company);
			let $match = { company: companyID };
			const q = $req.query.q;
			if (q) {
				$match = {
					company: companyID,
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
		const { Part, FormSchema } = $req.db.models;
		
		// Resolve schema
		const schemaID = $req.body.formSchema;
		let extended = null;
		if (schemaID) {
			const schema = await FormSchema.findById(schemaID);
			if (!schema) return $res.error('invalid_schema');
			
			const extendedData = $req.body.extended;
			extended = new Types.Map();
			
			for (const i of schema.fields.keys()) {
				const f = schema.fields.get(i);
				if (extendedData[i]) extended.set(i, extendedData[i]);
				else extended.set(i, f.default || null);
			}
		}
		
		const part = await Part.create({
			company: $req.user.company,
			category: $req.body.category,
			partNum: $req.body.partNum,
			description: $req.body.description,
			formSchema: schemaID,
			active: true,
			extended,
			created: new Date(),
			updated: new Date(),
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
		part.formSchema = $req.body.formSchema;
		part.updated = new Date();
		
		// Form schema fields
		if (part.formSchema) {
			// Fetch schema
			const schema = await FormSchema.findById(part.formSchema).lean();
			
			if (!part.extended) part.extended = new Types.Map();
			
			// Update extended data fields
			const extendedData = $req.body.extended || {};
			
			const fieldKeys = [];
			for (const i in schema.fields) {
				fieldKeys.push(i);
				
				// Update part extended data
				if (extendedData[i] !== undefined) part.extended.set(i, extendedData[i]);
				else part.extended.set(i, schema.fields[i].default || null);
			}
			
			// Remove extended data not in fieldKeys
			for (const key of part.extended.keys()) {
				if (!fieldKeys.includes(key)) part.extended.delete(key);
			}
		} else {
			// No schema set, set extended to null
			part.extended = null;
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