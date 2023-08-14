import RunCount from '@/schemas/RunCount'

export async function getNextCount(key, trx) {
	let nextCount = 1;
	const record = await RunCount.query(trx).findById(key);
	if (record) {
		await record.$query(trx).increment('count', 1);
		nextCount = record.count + 1;
		
	} else {
		// Create new record
		await RunCount.query(trx).insert({ runID: key, count: 1 });
	}
	
	return nextCount;
}