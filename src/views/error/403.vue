<template>
	<div class="contain flex error-403 center">
		<div>
			<h1>403</h1>
			<p class="pt15">很抱歉，此页面仅仅管理员可查看！</p>
		</div>
	</div>
</template>
<script>
export default {
	name: '/403',
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
.error-403 {
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