<template>
	<div class="contain flex-g1 flex-view">
		Dashboard
	</div>
</template>
<script>
export default {
	name: '/',
	data() {
		return {
			msg: '',
			list: []
		}
	},
	methods: {

	},
	mounted() {
		this.insertJs('https://www.echartsjs.com/zh/dist/echarts-gl.min.js').then(() => {

		})
	}
}
</script>
<style>
</style>