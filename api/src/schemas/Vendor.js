import { Schema } from 'mongoose'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	
	name: String,
	
	
}, {
	collection: 'vendors',
})