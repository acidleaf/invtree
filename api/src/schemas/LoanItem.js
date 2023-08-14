import { Schema } from 'mongoose'

export default new Schema({
	loan: {
		type: Schema.Types.ObjectId,
		ref: 'Loan',
		index: true,
	},
	item: {
		type: Schema.Types.ObjectId,
		ref: 'Item',
		index: true,
	},
	
	// Whether the item has been returned yet
	returned: Boolean,
	
	
	// When the item was returned
	returnDate: Schema.Types.Date,
	
}, {
	collection: 'loan_items'
});