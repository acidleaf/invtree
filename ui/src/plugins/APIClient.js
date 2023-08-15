
export default function(baseURL) {
	let _authHeader = null;
	let _authToken = null;
	
	this.setAuthToken = (authHeader, token) => {
		_authHeader = authHeader;
		_authToken = token;
	};
	
	this.request = async (method, path, data, additionalHeaders) => {
		const headers = {
			'Content-Type': 'application/json',
			...additionalHeaders
		};
		if (_authToken) headers[_authHeader] = _authToken;
		
		const res = await fetch(`${baseURL}/${path}`, {
			method,
			headers,
			body: JSON.stringify(data),
		});
		
		const isJson = res.headers.get('content-type') == 'application/json';
		const resData = isJson ? await res.json() : null;
		
		if (!res.ok) return Promise.reject(resData);
		return Promise.resolve(resData);
	};
}
