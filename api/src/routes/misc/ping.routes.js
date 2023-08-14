export default [{
    method: 'GET',
    path: '/ping',
    scopes: 'any',
    async handler($req, $res) {
        return $res.json('ok');
    }
}]