import { Schema } from 'mongoose'
import LoanItem from './LoanItem'

export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true,
	},
	
	// User facing label
	loanNum: {
		type: String,
		index: true,
	},
	
	// Loan's status (draft, active, closed, void)
	status: {
		type: String,
		index: true,
	},
	
	// Loan item records
	items: [ LoanItem ],
	
	
	// The user this loan was created on behalf of
	requestedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		index: true,
	},
	
	// The user who created this loan
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		index: true,
	},
	
	
	loanDate: Schema.Types.Date,			// When the record was created
	dueDate: Schema.Types.Date,				// When the loan is due (supposed to be returned)
	returnDate: Schema.Types.Date,			// When the loan was actually closed
	
}, {
	collection: 'loans'
});