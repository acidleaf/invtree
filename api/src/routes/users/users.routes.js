import PaginationMiddleware from '@/middlewares/PaginationMiddleware'
import UserScopes from '@/common/UserScopes'
import bcryptjs from 'bcryptjs'
import { Types } from 'mongoose'

export default [{
	method: 'GET',
	path: '/users',
	scopes: [ UserScopes.USER_EDIT ],
	handler: [
		PaginationMiddleware,
		async function($req, $res) {
			const { User } = $req.db.models;
			
			// Search query
			const companyID = new Types.ObjectId($req.user.company);
			let $match = { company: companyID };
			const q = $req.query.q;
			if (q) {
				$match = {
					company: companyID,
					$or: [
						{ userName: { $regex: q, $options: 'i' }},
						{ email: { $regex: q, $options: 'i' }}
					]
				};
			}
			
			// Sort query
			let $sort = { 'user.userName': 1 };
			if ($req.query.sort) {
				const order = $req.query.order ? parseInt($req.query.order) : 1;
				$sort = { [$req.query.sort]: order };
			}
			
			// Aggregation pipeline for part search
			const users = await User.aggregate([
				{ $match },
				{ $sort },
				{ $skip: $req.pagination.skip },
				{ $limit: $req.pagination.limit },
				
				{ $unset: ['__v', 'company', 'password' ]},
			]);
			
			// Count total with match condition
			const total = await User.count($match);
			
			return $res.json({
				total,
				results: users,
			});
		}
	]
}, {
	method: 'GET',
	path: '/users/:userID',
	scopes: [ UserScopes.USER_EDIT ],
	async handler($req, $res) {
		const userID = $req.params.userID;
		
		const { User } = $req.db.models;
		const user = await User.findById(userID, '-__v -password -company');
		if (!user) return $res.error('invalid_user');
		
		return $res.json(user);
	}
}, 
{
	// Create new user
	method: 'POST',
	path: '/users',
	scopes: [ UserScopes.USER_EDIT ],
	async handler($req, $res) {
		const company = $req.user.company;
		
		const { User } = $req.db.models;
		
		// Check if existing accountName in use
		const existing = await User.findOne({
			company,
			accountName: $req.body.accountName,
			active: true
		});
		if (existing) return $res.error('account_name_exists');
		
		
		
		// Create user record
		const passwordHash = bcryptjs.hashSync($req.body.password);
		const user = await User.create({
			company,
			userName: $req.body.userName,
			accountName: $req.body.accountName,
			email: $req.body.email,
			password: passwordHash,
			active: true,
		});
		
		return $res.json(user);
	}
}, {
	// Update user details
	method: 'PUT',
	path: '/users/:userID',
	scopes: [ UserScopes.USER_EDIT ],
	async handler($req, $res) {
		const userID = $req.params.userID;
		
		const { User } = $req.db.models;
		const user = await User.findById(userID);
		if (!user) return $res.error('invalid_user');
		
		user.userName = $req.body.userName;
		user.accountName = $req.body.accountName;
		user.email = $req.body.email;
		if ($req.body.password) user.password = bcryptjs.hashSync($req.body.password);
		await user.save();
		
		return $res.json();
	}
}, {
	// Mark user as inactive
	method: 'DELETE',
	path: '/users/:userID',
	scopes: [ UserScopes.USER_EDIT ],
	async handler($req, $res) {
		const userID = $req.params.userID;
		
		const { User } = $req.db.models;
		const user = await User.findById(userID);
		if (!user) return $res.error('invalid_user');
		
		user.active = false;
		await user.save();
		
		return $res.json();
	}
}]