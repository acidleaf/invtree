import { Schema } from 'mongoose'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true
	},
	type: {
		type: String,
		index: true,
	},
	schemaName: String,
	
	// All additional fields defined by this schema
	fields: Schema.Types.Map,
	
}, {
	collection: 'form_schemas'
})