<template>
	<div>
		<Navbar />
		
		<Breadcrumbs />
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


</script>