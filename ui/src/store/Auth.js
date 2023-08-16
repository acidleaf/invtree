import { defineStore } from 'pinia'
import $api from '@/services/API'
import jwt_decode from 'jwt-decode'
import jsrsasign from 'jsrsasign'
import { useConstantsStore } from './Constants'


const TOKEN_NAME = import.meta.env.VITE_APP_TOKEN_NAME;

export const useAuthStore = defineStore('auth', {
	state() {
		return {
			jwt: null,
			userID: null,
			userName: null,
			accountName: null,
			scopes: [],
		};
	},
	
	getters: {
		isAuthenticated() { return this.jwt != null; },
	},
	
	actions: {
		
		// Session verified, store state
		authOK(jwt, decoded) {
			this.jwt = jwt;
			this.userID = decoded.sub;
			this.userName = decoded.name;
			this.accountName = decoded.acc;
			this.scopes = decoded.scopes ? decoded.scopes.split(',') : [];
			
			// Set JWT to REST client
			$api.setAuthToken('Authorization', `Bearer ${jwt}`);
			
			// Store refresh token
			localStorage.setItem(TOKEN_NAME, jwt);
		},
		async deAuth() {
			// Clear state
			this.jwt = null;
			this.userID = null;
			this.userName = null;
			this.accountName = null;
			this.scopes = [];
			
			// Remove tokens and stuff
			localStorage.removeItem(TOKEN_NAME);
			$api.setAuthToken(null, null);
		},
		
		// Called from Login page
		async authenticate(payload) {
			const res = await $api.request('POST', 'auth', { ...payload });
			const verified = await this.verifyAuthResponse(res);
			return verified;
		},
		
		// Called on app load to restore last session
		async refresh() {
			const token = localStorage.getItem(TOKEN_NAME);
			if (!token) return false;
			
			let verified = false;
			try {
				const res = await $api.request('POST', 'auth/refresh', { token });
				verified = await this.verifyAuthResponse(res);
				
			} catch(err) {
				console.error(err);
			}
			return verified;
		},
		
		
		// Verify auth response from API, should be used by all auth methods
		async verifyAuthResponse(res) {
			if (!res) return false;
			
			try {
				const jwt = res.jwt;
				const valid = jsrsasign.jws.JWS.verifyJWT(jwt, import.meta.env.VITE_APP_JWT_PUBLIC_KEY, {
					alg: [ 'RS256' ],
					iss: [ import.meta.env.VITE_APP_JWT_ISSUER ],
					aud: [ import.meta.env.VITE_APP_JWT_AUDIENCE ],
					gracePeriod: 60,
				});
				if (!valid) throw new Error('invalid_jwt');
				
				const decoded = jwt_decode(jwt);
				await this.authOK(jwt, decoded);
				
				// Load constants
				const $constantsStore = useConstantsStore();
				await $constantsStore.load(res.constants);
				
			} catch(err) {
				console.error(err);
				return false;
			}
			
			return true;
		}

	}
});
