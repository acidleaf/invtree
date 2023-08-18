import UserScopes from '@/common/UserScopes'
import PaginationMiddleware from '@/middlewares/PaginationMiddleware'
import { Types } from 'mongoose'

export default [{
	method: 'GET',
	path: '/items',
	scopes: [ UserScopes.ITEMS_VIEW, UserScopes.ITEMS_EDIT ],
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
			const { Item } = $req.db.models;
			
			
			// Sort query
			let $sort = { 'item.part.partNum': 1 };
			if ($req.query.sort) {
				const order = $req.query.order ? parseInt($req.query.order) : 1;
				$sort = { [$req.query.sort]: order };
			}
			
			// Aggregation pipeline for part search
			const items = await Item.aggregate([
				{ $match: {
					company: new Types.ObjectId($req.user.company),
				}},
				{ $lookup: {
					from: 'parts',
					localField: 'part',
					foreignField: '_id',
					as: 'part',
				}},
				{ $unwind: '$part' },
				{ $lookup: {
					from: 'part_categories',
					localField: 'part.category',
					foreignField: '_id',
					as: 'category'
				}},
				{ $unwind: '$category' },
				
				{ $sort },
				{ $skip: $req.pagination.skip },
				{ $limit: $req.pagination.limit },
				
				{ $unset: ['__v', 'company', 'part.company' ]},
			]);
			
			// Count total with match condition
			const total = await Item.count({ company: $req.user.company });
			
			return $res.json({
				total,
				results: items,
			});
		}
	]
}, {
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
		
		return $res.json(item);
	}
}, {
	// Create new item record
	method: 'POST',
	path: '/items',
	scopes: [ UserScopes.ITEMS_EDIT ],
	async handler($req, $res) {
		const { Part, Item, FormSchema } = $req.db.models;
		
		const part = await Part.findById($req.body.partID);
		if (!part || !part.active) return $res.error('invalid_part');
		
		await part.populate('itemSchema');
		
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
		
		// Create item record
		const item = await Item.create({
			company: $req.user.company,
			part: part._id,
			
			serialNum: $req.body.serialNum,
			
			formSchema: schemaID,
			extended,
			loan: null,
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
		const itemID = $req.params.itemID;
		const { Item, FormSchema } = $req.db.models;
		
		const item = await Item.findById(itemID);
		if (!item || !item.active) return $res.error('invalid_item');
		
		
		// Update item fields
		item.serialNum = $req.body.serialNum;
		item.updated = new Date();
		
		// Form schema fields
		if (item.formSchema) {
			// Fetch schema
			const schema = await FormSchema.findById(item.formSchema).lean();
			if (!schema) return $res.error('invalid_schema');
			
			// Update extended data fields
			if (!item.extended) item.extended = new Types.Map();
			const extendedData = $req.body.extended || {};
			
			const fieldKeys = [];
			for (const i in schema.fields) {
				// Update part extended data
				if (extendedData[i] !== undefined) item.extended.set(i, extendedData[i]);
				else item.extended.set(i, schema.fields[i].default || null);
				fieldKeys.push(i);
			}
			
			// Remove extended data not in fieldKeys
			for (const key of item.extended.keys()) {
				if (!fieldKeys.includes(key)) item.extended.delete(key);
			}
		} else {
			// No schema set, set extended to null
			item.extended = null;
		}
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