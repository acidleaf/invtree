import { Schema } from 'mongoose'

const FormSchemaField = new Schema({
	_id: false,
	key: {
		type: String,
		index: true,
	},
	
	// Label to display on the input
	label: String,
	
	// Input element type
	elementType: {
		type: String,
		enum: [ 'text', 'textarea', 'select', 'radio', 'checkbox' ],
		default: 'text',
	},
	
	// value for <input type="value">
	inputType: {
		type: String,
		default: 'text',
	},
	
	// Placeholder value for elementType = text, textarea
	placeholder: String,
	
	// Used for multiple choice inputs: select, radio, checkboxes
	choices: [{
		key: String,
		value: String,
	}],
	
	// Default value
	default: {
		type: String,
		default: '',
	},
	
	// Whether this field is compulsory
	required: {
		type: Boolean,
		default: false,
	}
});


export default new Schema({
	company: {
		type: Schema.Types.ObjectId,
		ref: 'Company',
		index: true
	},
	type: {
		type: String,
		index: true,
	},
	
	// Name of schema, usually displayed as type
	name: String,
	
	// All additional fields defined by this schema
	fields: {
		type: Map,
		of: FormSchemaField,
	},
	
	
	// Layout of the form, an array of array of strings
	// Each first level array specifies a row, second level references the formSchema field to be placed at the position
	// Each row component's width will be split evenly with flex space-evenly
	layout: [ [ String ] ],
	
	
	created: Schema.Types.Date,
	updated: Schema.Types.Date,
	
}, {
	collection: 'form_schemas'
});