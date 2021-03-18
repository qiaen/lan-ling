<template>
	<section class="daily bgfff center">
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
	mounted() {}
}
</script>
<style lang="less">
.daily {
	.nothing {
		width: 400px;
	}
}
</style>