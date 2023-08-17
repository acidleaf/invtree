import { Schema } from 'mongoose'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	customer: {
		type: Schema.Types.ObjectId,
		ref: 'Customer',
		index: true,
	},
	
	name: String,
	contact: String,
	email: String,
	
	active: Boolean,
	
	createdBy: Schema.Types.ObjectId,
	created: Schema.Types.Date,
	updated: Schema.Types.Date,
	
}, {
	collection: 'customer_contacts'
});