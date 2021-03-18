<template>
	<div class="checkin-map">
		<el-collapse v-model="activeNames">
			<el-collapse-item name="1">
				<sline slot="title" title="字段映射" size="big"></sline>
				<ul class="flex word-map">
					<li class="flex1">
						<el-table v-loading="loading.columnName" class="zm-table" :data="data.columnName">
							<el-table-column prop="columnName" label="字段名称" align="center" show-overflow-tooltip></el-table-column>
							<el-table-column prop="columnType" label="字段类型" width="95" align="center" show-overflow-tooltip></el-table-column>
							<el-table-column label="操作" width="80" align="center">
								<template slot-scope="scope">
									<el-button @click="deleteDataColumn(scope.$index, scope.row.pageMapIndex)" type="text" size="small" :disabled="active == 4" icon="el-icon-delete-solid"></el-button>
								</template>
							</el-table-column>
						</el-table>
					</li>
					<li class="map-line shrink0 relative">
						<div v-for="(item, index) in lines" :key="index" :style="comptLine(item)" class="map-lines absolute"></div>
					</li>
					<li class="flex1">
						<el-table v-loading="loading.hiveColumn" class="zm-table" :data="data.hiveColumn">
							<el-table-column prop="columnName" label="字段名称" align="center" show-overflow-tooltip></el-table-column>
							<el-table-column prop="columnType" label="字段类型" width="95" align="center" show-overflow-tooltip></el-table-column>
							<el-table-column label="是否脱敏" width="80" align="center">
								<template slot-scope="scope">
									<el-checkbox v-model="scope.row.isMask" :true-label="1" :false-label="0" :disabled="active == 4"></el-checkbox>
								</template>
							</el-table-column>
						</el-table>
					</li>
				</ul>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>
<script>
export default {
	props: ['active', 'data', 'loading', 'passed'],
	name: 'checkin-map',
	data() {
		return {
			activeNames: ['1']
		}
	},
	computed: {
		// 连线
		lines() {
			// top, width, deg
			let lines = []
			let dt = this.data.columnName || []
			let ht = this.data.hiveColumn || []
			let dlen = dt.length
			let hlen = ht.length
			if (dlen && hlen) {
				dt.forEach((a, aIndex) => {
					for (let i = 0; i < ht.length; i++) {
						if (a.columnName.toLowerCase() === ht[i].columnName.toLowerCase()) {
							// 记录右侧表映射在左侧的index，用于删除操作
							a.pageMapIndex = i
							let temp = {}
							temp.top = (41 + aIndex * 34 + 17) * 100 / (dlen * 34 + 41)
							let diff = i - aIndex
							let w = Math.sqrt(Math.pow(210, 2) + Math.pow(Math.abs(diff) * 34, 2))
							temp.width = w
							let deg = 360 * Math.atan(diff * 34 / 210) / (2 * Math.PI)
							temp.deg = deg
							lines.push(temp)
							break
						}
					}
				})
			}
			let llen = lines.length
			let passed = llen === 0 ? false : dlen === llen && dlen === hlen
			this.$emit('update:passed', passed)
			return lines
		}
	},
	methods: {
		// 删除字段映射，左侧index｜在右侧映射的index
		deleteDataColumn(index, mapIndex) {
			if (this.data.columnName.length <= 1) {
				this.$message.warning('请至少保留一条映射字断！')
			} else {
				this.data.columnName.splice(index, 1)
				if (!isNaN(mapIndex)) {
					this.data.hiveColumn.splice(mapIndex, 1)
				}
			}
		},
		// 返回连线样式
		comptLine(item) {
			return {
				top: item.top + '%',
				width: item.width + 'px',
				transform: `rotate(${item.deg}deg)`,
				'transform-origin': '0 0'
			}
		}
	}
}
</script>
<style lang="less">
.checkin-map {
	.form-line {
		margin-left: 1.2%;
	}
	.zm-table tbody td {
		height: 34px !important;
	}
	.word-map>li {
		width: 33.33%;
		&.map-line {
			width: 250px;
		}
	}
	.el-collapse, .el-collapse-item__wrap {
		border: none !important;
	}
}
// 映射小箭头
.map-lines {
	width: 210px;
	height: 2px;
	background: #29B879;
	left: 22px;

	&:before, &:after {
		content: '';
		display: inline-block;
		position: absolute;
	}
	&:before {
		width: 4px;
		height: 4px;
		border-radius: 4px;
		border: 2px solid $background;
		top: -3px;
		left: -6px;
	}
	&:after {
		right: -5px;
		top: -2px;
		width: 6px;
		height: 6px;
		border-radius: 6px;
		background-color: $background;
	}
}
</style>