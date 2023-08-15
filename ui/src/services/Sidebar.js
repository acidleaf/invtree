import { emitter } from '@/utils'


export default {
	show() { emitter.emit('sidebar/show'); },
	hide() { emitter.emit('sidebar/hide'); },
	toggle() { emitter.emit('sidebar/toggle'); },
}
