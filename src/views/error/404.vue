<template>
	<div class="contain flex error-404 center">
		<div>
			<h1>404</h1>
			<p class="pt15">很抱歉，你访问的页面不存在！</p>
		</div>
	</div>
</template>
<script>
export default {
	name: '/404',
	data() {
		return {
			msg: '',
			list: []
		}
	},
	methods: {

	},
	mounted() {}
}

</script>
<style lang="less">
.error-404 {
	text-align: center;
	h1 {
		font-size: 60px;
		color: #e6a23c;
		font-style: italic;
		font-weight: bold;
	}
	p {
		font-size: 24px;
		color: #909399;
	}
}
</style>
