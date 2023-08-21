<template>
	<div>
		<Navbar />
		
		<Breadcrumbs v-if="$authStore.isAuthenticated" />
		<NestedRoutes />
		
		
		<SidebarContainer>
			<Sidebar />
		</SidebarContainer>
		<ConfirmDialog />
		<ToastContainer />
	</div>
</template>
<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import Navbar from '@/views/Navbar/Navbar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import SidebarContainer from '@/components/SidebarContainer.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Sidebar from '@/views/Sidebar/Sidebar.vue'
import NestedRoutes from './layouts/NestedRoutes.vue'
import { useAuthStore } from './store/Auth'

const $authStore = useAuthStore();


</script>