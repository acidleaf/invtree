import bcryptjs from 'bcryptjs'
import { fetchConstants, generateJWT } from './_helpers'

export default [{
	method: 'POST',
	path: '/auth',
	scopes: 'any',
	async handler($req, $res) {
		const { Company, User } = $req.db.models;
		
		// Find company
		const company = await Company.findOne({ companyCode: $req.body.ccode });
		if (!company) return $res.error('invalid_auth');
		
		// Find user
		const uid = $req.body.uid;
		const pwd = $req.body.pwd;
		const user = await User.findOne({
			company: company._id,
			accountName: uid,
		});
		if (!user || !user.active) return $res.error('invalid_auth');
		if (!bcryptjs.compareSync(pwd, user.password)) return $res.error('invalid_auth');
		
		
		const jwt = generateJWT(user);
		const constants = await fetchConstants($req.db, user.company);
		
		return $res.json({
			jwt,
			constants,
		});
	}
}]