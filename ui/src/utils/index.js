// Debounce function
export function debounce(callback, delay = 250) {
	let interval;
	return (...args) => {
		clearTimeout(interval);
		interval = setTimeout(() => {
			interval = null;
			callback(...args);
		}, delay);
	}
}



// Event bus
import mitt from 'mitt'
export const emitter = mitt();