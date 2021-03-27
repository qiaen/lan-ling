<template>
	<section class="dashboard bgfff center">
		<img class="nothing" src="@img/nothing.png" alt="">
	</section>
</template>
<script>
import Enum from '@configs/enum'
import * as Task from '@api/Task'
import Mixins from '@/mixins'
export default {
	name: '/',
	mixins: [Mixins],
	data() {
		return {

		}
	},
	methods: {
		get() {

		}
	},
	mounted() {
		this.insertJs('https://unpkg.com/vuex@3.6.2/dist/vuex.min.js').then(() => {
			console.log('vuex.min.js 已经被引用')
		})
	}
}
</script>
<style lang="less">
.dashboard {
	.nothing {
		width: 400px;
	}
}
</style>