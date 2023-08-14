import jsonwebtoken from 'jsonwebtoken'
import { generateJWT } from './_helpers'

export default [{
	method: 'POST',
	path: '/auth/refresh',
	scopes: 'any',
	async handler($req, $res) {
		const token = $req.body.token;
		
		let decoded = null;
		try {
			// Verify token
			decoded = jsonwebtoken.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: 'RS256' });
			
		} catch(err) {
			console.error(err);
			return $res.json(null);
		}
		
		// Fetch user details and generate new token
		const { User } = $req.db.models;
		const user = await User.findById(decoded.sub);
		if (!user || !user.active) return $res.json(null);
		if (user.company != decoded.cpy) return $res.json(null);
		
		const jwt = generateJWT(user);
		return $res.json({ jwt });
	}
}]