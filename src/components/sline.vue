<template>
	<div class="form-line fxmiddle flex" :class="{'form-line-big': size == 'big'}">
		<span></span>
		<label>{{title}}</label>
		<div class="flex1 descript">
			<slot name="descript"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'line',
	// 显示文字，是否显示线条，尺寸，是否显示绿色线条
	props: ['title', 'line', 'size'],
	data() {
		return {}
	}
}

</script>
<style lang="less">
.form-line {
	span {
		display: block;
		width: 3px;
		height: 16px;
		background: #29b87a;
	}
	label {
		padding: 0 6px;
		color: #343a43;
		font-size: 14px;
		font-weight: bold;
	}
	.descript {
		text-align: right;
	}
	/*p {
		height: 1px;
		background: #dbe2ea;
	}*/
}
.form-line-big {
	span {
		height: 20px;
		width: 4px;
	}
	label {
		padding: 0 8px;
		font-size: 18px;
	}
}

</style>
