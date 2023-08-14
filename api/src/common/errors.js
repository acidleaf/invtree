export class RouteError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
}