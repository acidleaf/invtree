
export default function($req, $res, $next) {
	
	const page = parseInt($req.query.page) || 0;
	const limit = parseInt($req.query.limit) || 25;
	
	$req.pagination = {
		page,
		limit,
		skip: page * limit,
	};
	
	$next();
}