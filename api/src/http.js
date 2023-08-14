import { sprout } from '@acidleaf/sprout'
import http from 'http'
import appConfig from './app'

const app = sprout({
	baseURL: process.env.API_BASEPATH,
	parseBody: true,
	checkScopes: true,
	middlewares: appConfig.middlewares,
	routes: appConfig.routes,
});



const httpPort = process.env.HTTP_PORT || 0;
export const server = http.createServer(app).listen(httpPort);

console.log(`Server listening on ${server.address().port}`);