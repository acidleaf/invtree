import bcrypt from 'bcryptjs'

export default [{
	// Fetch user profile
	method: 'GET',
	path: '/profile',
	scopes: 'auth',
	async handler($req, $res) {
		const userID = $req.user.userID;
		const { User } = $req.db.models;
		
		const user = await User.findById(userID, '-__v -password -company');
		if (!user || !user.active) return $res.error('invalid_user');
		
		return $res.json(user);
	}
}, {
	// Update user profile
	method: 'PUT',
	path: '/profile',
	scopes: 'auth',
	async handler($req, $res) {
		const userID = $req.user.userID;
		const { User } = $req.db.models;
		
		const user = await User.findById(userID);
		if (!user || !user.active) return $res.error('invalid_user');
		
		user.userName = $req.body.userName;
		user.email = $req.body.email;
		if ($req.body.password) user.password = bcrypt.hashSync($req.body.password);
		await user.save();
		
		
		return $res.json();
	}
}]