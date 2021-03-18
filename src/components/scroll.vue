<template>
	<div ref="scrollbox" class="flex1 scroll-y tmobar" @scroll="roll">
		<div ref="outbox">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	methods: {
		roll() {
			let refs = this.$refs
			var _ch = refs.outbox.offsetHeight;
			var _bh = refs.scrollbox.offsetHeight;
			var _sh = refs.scrollbox.scrollTop
			if (_ch - _sh - _bh <= 0) {
				this.$emit('scrolling')
			}
		}
	}
}

</script>
