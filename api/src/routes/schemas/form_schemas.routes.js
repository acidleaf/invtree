import UserScopes from '@/common/UserScopes'

export default [{
	method: 'GET',
	path: '/schemas/form/:schemaID',
	scopes: [ UserScopes.SCHEMA_EDIT ],
	async handler($req, $res) {
		const schemaID = $req.params.schemaID;
		
		const { FormSchema } = $req.db.models;
		const schema = await FormSchema.findById(schemaID);
		if (!schema || schema.company != $req.user.company) return $res.error('invalid_schema');
		
		return $res.json(schema);
	}
}]