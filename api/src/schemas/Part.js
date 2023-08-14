import { Schema } from 'mongoose'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	
	category: {
		type: Schema.Types.ObjectId,
		ref: 'PartCategory',
		index: true,
	},
	
	partNum: {
		type: String,
		index: true,
	},
	
	// Item description
	description: String,
	
	
	// The schema stores additional fields not shared among records
	formSchema: {
		type: Schema.Types.ObjectId,
		ref: 'FormSchema',
		index: true,
	},
	
	
	active: Boolean,
	created: Schema.Types.Date,
	
}, {
	collection: 'parts'
});