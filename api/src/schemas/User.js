import { Schema } from 'mongoose'

export default new Schema({
	
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	
	
	// Main user details
	userName: String,
	accountName: {
		type: String,
		index: true,
	},
	email: String,
	
	password: String,
	active: Boolean,
	
	scopes: [ String ]
	
}, {
	collection: 'users'
});