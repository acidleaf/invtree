import { defineStore } from 'pinia'
import { useSchemaStore } from './Schema'

export const useConstantsStore = defineStore('constants', {
	state() {
		return {
			partCategories: []
		};
	},
	getters: {
		PartCategoryMap() {
			const cat = {};
			for (const i in this.partCategories) {
				const c = this.partCategories[i];
				cat[c._id] = c;
			}
			return cat;
		}
	},
	actions: {
		async load(constants) {
			this.partCategories = constants.partCategories;
			
			// Populate form schemas
			const $schemaStore = useSchemaStore();
			$schemaStore.load(constants.formSchemas);
		},
		async unload() {
			this.partCategories = [];
			
			const $schemaStore = useSchemaStore();
			$schemaStore.unload();
		}
	}
});