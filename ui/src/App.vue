<template>
	<div>
		<Navbar />
		
		<router-view v-slot="slotProps">
			<transition name="fade" mode="out-in">
				<component :is="slotProps.Component"></component>
			</transition>
		</router-view>
		
		<SidebarContainer>
			<Sidebar />
		</SidebarContainer>
		<ConfirmDialog />
		<ToastContainer />
	</div>
</template>
<script setup>
import Navbar from '@/views/Navbar/Navbar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import SidebarContainer from '@/components/SidebarContainer.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Sidebar from '@/views/Sidebar/Sidebar.vue'


</script>