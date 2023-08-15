<template>
	<div class="h-full flex flex-col">
		<div class="py-2 mb-1 text-center border-b border-gray-200">
			
			<div class="text-sm text-gray-400">InvTree</div>
			<div v-if="isAuthenticated" class="text-xl font-medium mt-1 text-info">
				<div>{{ userName }}</div>
			</div>
		</div>
		
		
		<div v-if="isAuthenticated" class="overflow-y-auto">
			<template v-for="l in sidebarLinks">
				<MultiLink v-if="l.multi" v-bind="l" />
				<SingleLink v-else v-bind="l" />
			</template>
		</div>
		
		<!-- Sign out link -->
		<div v-if="isAuthenticated"
			@click="signOut"
			class="flex items-center gap-2 hover:bg-gray-200 transition-colors px-3 py-2 select-none cursor-pointer font-medium">
			<icon :data="mdiLogoutVariant" />
			<div>Sign Out</div>
		</div>
	</div>
</template>
<script setup>
import { $confirm, $sidebar } from '@/services'
import { useAuthStore } from '@/store/Auth'
import { mdiLogoutVariant } from '@mdi/js'
import { useRouter } from 'vue-router'
import sidebarLinks from './sidebarLinks'

import MultiLink from './MultiLink.vue'
import SingleLink from './SingleLink.vue'
import { storeToRefs } from 'pinia'


const $router = useRouter();
const $authStore = useAuthStore();
const { userName, isAuthenticated } = storeToRefs($authStore);

async function signOut() {
	$sidebar.hide();
	
	const confirm = await $confirm({
		title: 'Signing Out',
		message: 'Are you sure you wish to sign out?',
		buttons: 'YES_NO',
	});
	if (!confirm) return;
	
	await $authStore.deAuth();
	$router.replace('/login');
	$sidebar.hide();
}


</script>