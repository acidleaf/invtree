import { Schema } from 'mongoose'

const Part = new Schema({
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
	
	extended: {
		type: Map,
		of: Schema.Types.Mixed
	},
	
	
	active: Boolean,
	created: Schema.Types.Date,
	
}, {
	collection: 'parts'
});


export default Part;