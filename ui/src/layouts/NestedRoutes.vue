<template>
	
	
	<router-view v-slot="slotProps">
		<transition name="fade" mode="out-in">
			<component :is="slotProps.Component" v-bind="$attrs"></component>
		</transition>
	</router-view>
	
	
</template>