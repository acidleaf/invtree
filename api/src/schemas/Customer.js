import { Schema } from 'mongoose'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	
	name: String,
	address: String,
	email: String,
	contact: String,
	country: String,
	
	created: Schema.Types.Date,
	updated: Schema.Types.Date,
	
}, {
	collection: 'customers',
});