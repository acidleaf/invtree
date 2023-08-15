<template>
	<div class="relative min-h-full">
		<div class="absolute w-full bg-gray-800 h-1/2"></div>
		<div class="relative flex items-center justify-center">
		
			<div class="mx-4 w-full md:w-2/3 xl:w-1/4">
				<div class="pt-16 pb-10 text-center text-white">
					<div class="font-bold text-3xl mb-2">Sign In</div>
					<!--
					<div class="text-gray-300">Or <a href="" class="font-medium text-accent hover:text-accent-400">register an account</a></div>
					-->
				</div>
				
				
				<form @submit.prevent="signIn" class="space-y-4 w-full bg-white dark:bg-black px-6 py-6 rounded-lg shadow-xl">
					<div>
						<label class="label">Company Code</label>
						<input type="text" class="input w-full" placeholder="Enter company code" v-model.trim="formData.ccode">
					</div>
					<div>
						<label class="label">Username</label>
						<input type="text" class="input w-full" placeholder="Username" v-model.trim="formData.uid">
					</div>
					
					<div>
						<label class="label">Password</label>
						<input type="password" class="input w-full" placeholder="Password" v-model.trim="formData.pwd">
					</div>
					
					<div class="text-right">
						<a href="" class="text-right font-medium text-accent hover:text-accent-400">Forgot your password?</a>
					</div>
					
					<button class="btn accent w-full" :loading="submitting">Sign In</button>
					
				</form>
			</div>
		</div>
		
	</div>
</template>
<script setup>
import { $toast } from '@/services'
import { useAuthStore } from '@/store/Auth'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'


const $authStore = useAuthStore();
const $router = useRouter();
const submitting = ref(false);

const formData = reactive({
	ccode: '',
	uid: '',
	pwd: '',
});

function validate() {
	if (!formData.ccode) {
		$toast.error('Please enter a valid company code');
		return false;
	}
	if (!formData.uid) {
		$toast.error('Please enter a valid username');
		return false;
	}
	if (!formData.pwd) {
		$toast.error('Please enter your password');
		return false;
	}
	return true;
}

async function signIn() {
	if (!validate()) return;
	
	submitting.value = true;
	try {
		await $authStore.authenticate(formData);
		$router.replace('/');
		
		$toast.success('Signed in successfully');
		
	} catch (err) {
		console.error(err);
		$toast.error('Authentication failed');
	}
	submitting.value = false;
}

onMounted(() => {
	if ($authStore.isAuthenticated) {
		return $router.replace('/');
	}
});


</script>