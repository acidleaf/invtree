import UserScopes from '@/common/UserScopes'
import PaginationMiddleware from '@/middlewares/PaginationMiddleware'
import { Types } from 'mongoose'

export default [{
	method: 'GET',
	path: '/parts/:partID/items',
	scopes: [ UserScopes.PARTS_VIEW, UserScopes.PARTS_EDIT ],
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
			const partID = $req.params.partID;
			
			const { Item } = $req.db.models;
			
			// Sort query
			let $sort = { 'item.serialNum': 1 };
			if ($req.query.sort) {
				const order = $req.query.order ? parseInt($req.query.order) : 1;
				$sort = { [$req.query.sort]: order };
			}
			
			// Aggregation pipeline for part search
			const items = await Item.aggregate([
				{ $match: {
					company: new Types.ObjectId($req.user.company),
					part: new Types.ObjectId(partID),
				}},
				{ $sort },
				{ $skip: $req.pagination.skip },
				{ $limit: $req.pagination.limit },
				
				{ $unset: ['__v', 'company' ]},
			]);
			
			// Count total with match condition
			const total = await Item.count({ company: $req.user.company });
			
			return $res.json({
				total,
				results: items,
			});
		}
	]
}]