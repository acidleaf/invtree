import jwt from 'jsonwebtoken'

function extractArray(val) {
	if (Array.isArray(val)) return val;
	else if (typeof val == 'string') return val.split(',');
	return [];
}


export default function($req, $res, $next) {
	
	// Verify that the authorization header is present
	const authHeader = process.env.AUTH_HEADER || 'authorization';
	const authorization = $req.headers[authHeader];
	if (authorization) {
		const matches = authorization.match(/^Bearer (.*)$/)
		if (matches) {
			// Try to verify the token
			try {
				const token = matches[1];
				const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: [ 'RS256' ] });
				
				// Inject user data to the request object
				$req.user = {
					company: decoded.cpy,
					userID: decoded.sub,
					userName: decoded.name,
					scopes: extractArray(decoded.scopes),
				};
				
			} catch(err) {
				// Suppress TokenExpiredError
				if (err.message != 'jwt expired') console.error(err);
			}
		}
	}
	
	$next();
}