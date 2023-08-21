import { $api } from '@/services'
import { defineStore } from 'pinia'

// This store serves as a cache for all schemas used by the app
// - There may be more than one schema for each type

export const useSchemaStore = defineStore('schema', {
	state() {
		return {
			schemas: {}
		};
	},
	getters: {
		PartSchemas() {
			const schemas = {};
			for (const i in this.schemas) {
				const s = this.schemas[i];
				if (s.type == 'part') schemas[i] = s;
			}
			return schemas;
		},
		ItemSchemas() {
			const schemas = {};
			for (const i in this.schemas) {
				const s = this.schemas[i];
				if (s.type == 'item') schemas[i] = s;
			}
			return schemas;
		},
		LoanSchemas() {
			const schemas = {};
			for (const i in this.schemas) {
				const s = this.schemas[i];
				if (s.type == 'loan') schemas[i] = s;
			}
			return schemas;
		}
	},
	actions: {
		load(schemas) {
			this.schemas = [];
			for (const i in schemas) {
				const s = schemas[i];
				this.schemas[s._id] = {
					...s,
					_loaded: false,
				};
			}
		},
		unload() {
			this.schemas = {};
		},
		
		numSchemas(type) {
			let count = 0;
			for (const i in this.schemas) {
				const s = this.schemas[i];
				if (s.type == type) ++count;
			}
			return count;
		},
		
		async resolve(schemaID) {
			if (!this.schemas[schemaID]) throw 'invalid_schema';
			if (!this.schemas[schemaID]._loaded) {
				// Fetch schema lazily and mark as loaded
				const res = await $api.request('GET', `schemas/${schemaID}`);
				res._loaded = true;
				
				this.schemas[schemaID] = res;
			}
			return this.schemas[schemaID];
		},
	}
});