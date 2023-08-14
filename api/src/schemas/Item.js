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
	
	serialNum: {
		type: String,
		index: true,
	},
	
	status: String,
	active: Boolean,
	created: Schema.Types.Date,
	
}, {
	collection: 'items'
});