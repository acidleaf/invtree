import { emitter } from '@/utils'

export default {
	success(message) { emitter.emit('toast/add', { level: 'success',  message }); },
	error(message) { emitter.emit('toast/add', { level: 'error', message }); },
	warn(message) { emitter.emit('toast/add', { level: 'warn', message }); },
	info(message) { emitter.emit('toast/add', { level: 'info', message }); },
}
