import { Schema } from 'mongoose'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	part: {
		type: Schema.Types.ObjectId,
		ref: 'Part',
		index: true,
	},
	
	// Somewhat unique serial number
	serialNum: {
		type: String,
		index: true,
	},
	
	
	formSchema: {
		type: Schema.Types.ObjectId,
		ref: 'FormSchema',
	},
	
	// Extended fields from schema
	extended: {
		type: Map,
		of: Schema.Types.Mixed,
	},
	
	// The current (active) loan the item is currently in
	loan: {
		type: Schema.Types.ObjectId,
		ref: 'Loan',
	},
	
	active: Boolean,
	created: Schema.Types.Date,
	updated: Schema.Types.Date,
	
}, {
	collection: 'items'
});