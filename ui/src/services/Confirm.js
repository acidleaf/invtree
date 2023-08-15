import { emitter } from '@/utils'

export default async function(options) {
	return new Promise((resolve, reject) => {
		if (!options) {
			reject('Invalid options');
			return;
		}
		// Trigger the confirm modal to show
		emitter.emit('confirm-dialog/open', {
			...options,
			callback: res => resolve(res),
		});
	});
}