import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import RelativeTime from 'dayjs/plugin/relativeTime'

// Global components
import Preloader from '@/components/Preloader.vue'
import Icon from '@/components/Icon.vue'

export default {
	async init(app) {
		// Register global components
		app.component('preloader', Preloader);
		app.component('icon', Icon);
		
		// Init dayjs plugins
		dayjs.extend(RelativeTime);
		dayjs.extend(customParseFormat);
	}
}