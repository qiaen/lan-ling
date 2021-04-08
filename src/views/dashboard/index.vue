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
		return {}
	},
	methods: {
		get() {

		}
	},
	mounted() {
		/* this.insertJs('https://statics-lib.zmlearn.com/vue/2.6.6/vue.min.js').then(() => {
			console.log('vue.min.js 已经被引用')
		}) */
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