import PartList from './PartList/PartList.vue'
import PartView from './PartView/PartView.vue'

export default [{
	name: 'part_list',
	path: '/parts',
	component: PartList,
	meta: {
		title: 'Parts Management',
		scopes: [ 'parts:view', 'parts:edit' ]
	}
}, {
	name: 'part_view',
	path: '/part/view/:partID',
	component: PartView,
	props: true,
	meta: {
		title: 'Part Details',
		scopes: [ 'parts:view' ]
	}
}]