<template>
	<Container>
		<div class="text-2xl font-semibold">{{ $route.meta.title }}</div>
		<hr>
		
		<preloader v-if="loading" />
		<div v-else>
			
			<div>
				<!-- Serial number -->
				<div>
					<label class="label">Serial Number</label>
					<input type="text" class="input w-full" v-model.trim="formData.serialNum" placeholder="Serial number of item">
				</div>
				
				
				
			</div>
			
			
		</div>
		
		
	</Container>
</template>
<script setup>
import Container from '@/layouts/Container.vue'
import { ref, reactive } from 'vue'

const props = defineProps([ 'itemID' ]);

const loading = ref(false);
const item = ref(null);
const schema = ref(null);
const schemaID = ref(null);

const formData = reactive({
	serialNum: '',
});




</script>