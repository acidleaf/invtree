import UserScopes from '@/common/UserScopes'
import bcryptjs from 'bcryptjs'

export default [{
	method: 'GET',
	path: '/users/:userID',
	scopes: [ UserScopes.USER_EDIT ],
	async handler($req, $res) {
		
		return $res.json();
	}
}, 

{
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
			password: passwordHash,
			active: true,
		});
		
		return $res.json(user);
	}
}]