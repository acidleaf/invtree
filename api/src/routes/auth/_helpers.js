import jsonwebtoken from 'jsonwebtoken'



// Generate JWT from user data
export function generateJWT(data) {
	const curTimestamp = Math.round(Date.now() / 1000);
	const validity = parseInt(process.env.JWT_VALIDITY);
	if (!validity || isNaN(validity)) throw new Error('Invalid value for JWT_VALIDITY');
	
	// base payload
	const payload = {
		iss: process.env.JWT_ISSUER,
		aud: process.env.JWT_AUDIENCE,
		iat: curTimestamp,
		exp: curTimestamp + validity,
		sub: data._id,
		name: data.userName,
		cpy: data.company,
	};
	
	// Assign scopes
	if (data.scopes) payload.scopes = data.scopes.join(',');
	
	
	return jsonwebtoken.sign(payload, process.env.JWT_PRIVATE_KEY, { algorithm: 'RS256' });
}



export async function fetchConstants(db, companyID) {
	const { ItemCategory } = db.models;
	
	const categories = await ItemCategory.find({ company: companyID }, 'name');
	
	return {
		categories,
	}
}