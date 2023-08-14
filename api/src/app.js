import { loadRoutes } from '@acidleaf/sprout'

// Initialize DB and create models
import db from '@/common/db'
import * as schemas from './schemas/**/*.js'
db.loadModels(schemas);


// Middlewares
import compression from 'compression'
import { CORSMiddleware } from '@acidleaf/sprout'
import JWTAuthMiddleware from '@/middlewares/JWTAuthMiddleware'
const middlewares = [
	CORSMiddleware,
	compression(),
	($req, $res, $next) => {
		$req.db = db;
		
		// Inject additional stuff here
		// ...
		
		$next();
	},
	JWTAuthMiddleware,
];

// Load routes
import * as routeGroups from './routes/**/*.routes.js'
const routes = loadRoutes(routeGroups);

export default {
	middlewares,
	routes,
}