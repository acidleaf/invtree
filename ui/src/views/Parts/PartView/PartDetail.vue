<template>
	<div class="px-2 py-2">
		<!-- Fixed fields -->
		<div v-if="part" class="space-y-3">
			<!-- Part number -->
			<div>
				<label class="label">Part Number</label>
				<input type="text" class="input w-full" :value="part.partNum" readonly placeholder="Part number">
			</div>
			
			<!-- Category -->
			<div>
				<label class="label">Category</label>
				<input type="text" class="input w-full"
					readonly
					placeholder="Part category"
					:value="PartCategoryMap[part.category] ? PartCategoryMap[part.category].name : 'Uncategorized'">
			</div>
			
			<!-- Part description -->
			<div>
				<label class="label">Description</label>
				<textarea class="input w-full" :value="part.description" readonly placeholder="Enter part description"></textarea>
			</div>
		</div>
		
		<!-- Extended fields -->
		<div v-if="schema" class="space-y-3">
			<div v-for="lt in schema.layout" class="md:flex md:gap-2 md:items-start md:justify-stretch md:space-y-0 space-y-3">
				<DynamicFormFieldView
					class="flex-grow"
					v-for="itemKey in lt"
					v-bind="{ schemaField: schema.fields[itemKey] }"
					:value="part.extended[itemKey]" />
			</div>
		</div>
		
		
		<!-- Edit actions-->
		<template v-if="canEdit">
			<hr>
			<div class="md:space-x-2 md:space-y-0 space-y-2">
				<router-link class="btn primary md:w-auto w-full" :loading="submitting" :to="`/parts/edit/${part._id}`">Edit Part</router-link>
				<button class="btn danger md:w-auto w-full" :loading="submitting" @click="inactivePart">Inactive Part</button>
			</div>
		</template>
		
		
	</div>
</template>
<script setup>
import DynamicFormFieldView from '@/components/DynamicFormFieldView.vue'
import { $api, $confirm, $toast } from '@/services'
import { useAuthStore } from '@/store/Auth'
import { useConstantsStore } from '@/store/Constants'
import { UserScopes } from '@/utils/enums'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps([ 'part', 'schema' ]);

const $router = useRouter();
const $constantsStore = useConstantsStore();
const { PartCategoryMap } = storeToRefs($constantsStore);

const $authStore = useAuthStore();
const { scopes } = storeToRefs($authStore);

const submitting = ref(false);

const canEdit = computed(() => {
	if (!props.part) return false;
	return scopes.value.includes(UserScopes.PARTS_EDIT);
});

async function inactivePart() {
	if (!props.part) return;
	
	const confirm = await $confirm({
		title: 'Inactive Part',
		message: 'Confirm to deactivate this part?',
		buttons: 'YES_NO',
	});
	if (!confirm) return;
	
	submitting.value = true;
	try {
		await $api.request('DELETE', `parts/${props.part._id}`);
		$router.replace('/parts');
		$toast.info('Part deactivated');
		
	} catch (err) {
		console.error(err);
		$toast.error('Failed to inactive part');
	}
	submitting.value = false;
}

</script>