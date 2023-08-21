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
	
	formSchema: {
		type: Schema.Types.ObjectId,
		ref: 'FormSchema',
	},
	extended: {
		type: Map,
		of: Schema.Types.Mixed
	},
	
	// Loan's current status
	status: {
		type: String,
		index: true,
		enum: [ 'draft', 'active', 'closed', 'void' ]
	},
	
	// Loan item records
	items: [ LoanItem ],
	
	
	// Stored as date strings: YYYY-MM-DD
	// When the record was created
	loanDate: {
		type: String,
		index: true,
	},
	// When the loan is due (supposed to be returned)
	dueDate: {
		type: String,
		index: true,
	},
	
	// When the loan was actually closed
	returnDate: {
		type: String,
		index: true,
		default: null,
	},
	
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
	
	created: Schema.Types.Date,
	closed: Schema.Types.Date,
	
}, {
	collection: 'loans'
});