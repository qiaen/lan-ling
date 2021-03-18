<template>
	<li class="check-type">
		<el-alert class="check-alert" title="当前仅支持作业类型Mysql2Hive，其他作业类型正在持续开发中..." :closable="false" show-icon>
		</el-alert>
		<sline title="作业类型" size="big" class="pt5"></sline>
		<ul class="flex types fxwrap">
			<li @dblclick="dbtap(item)" :class="{'selected': data.jobType === item.value, forbid: item.forbid}" v-for="item in types" :key="item.value" class="middle">
				<h2><i class="iconfont pr5" style="font-size: 40px;" :class="item.icon"></i>{{item.title}}</h2>
				<p class="plr15">{{item.description}}</p>
			</li>
		</ul>
		<div class="center flex">
			<el-button type="primary" size="small" @click="next(2)">下一步</el-button>
		</div>
	</li>
</template>
<script>
export default {
	props: ['active', 'data', 'loadNext'],
	name: 'checkin-type',
	data() {
		return {
			types: [{
				title: 'Mysql2Hive',
				value: 'mysql2hive',
				icon: 'icon-mysql',
				forbid: false,
				description: '数据由Mysql数据库同步至Hive数据库。'
			}, {
				title: 'Mongo2Hive',
				value: 'mongo2hive',
				icon: 'icon-mongodb',
				forbid: true,
				description: '数据由Mongo数据库同步至Hive数据库。'
			}, {
				title: 'Hive2Mysql',
				value: 'hive2mysql',
				icon: 'icon-hive',
				forbid: true,
				description: '数据由Hive数据库同步至Mysql数据库。'
			}, {
				title: 'Hive2ES',
				value: 'hive2es',
				icon: 'icon-hive',
				forbid: true,
				description: '数据由Hive数据库同步至ES数据库。'
			}, {
				title: 'Hive2Hbase',
				value: 'hive2hbase',
				icon: 'icon-hive',
				forbid: true,
				description: '数据由Hive数据库同步至Hbase数据库。'
			}, {
				title: 'Hive2Postgresql',
				value: 'hive2postgresql',
				icon: 'icon-hive',
				forbid: true,
				description: '数据由Hive数据库同步至Postgresql数据库。'
			}]
		}
	},
	methods: {
		dbtap(item) {
			if (!item.forbid) {
				this.next(2)
			}
		},
		next(val) {
			this.$emit('update:active', 2)
			this.$emit('update:loadNext', true)
		}
	}
}
</script>
<style lang="less">
.check-type {
	.form-line {
		margin: 0 1.2%;
	}
	.types li {
		&:not(.forbid) {
			cursor: pointer;
		}
		user-select: none;
		box-sizing: border-box;
		width: 30%;
		margin: 15px 1.6%;
		height: 160px;
		border-radius: 4px;
		border: 1px solid #eee;
		&.selected {
			background: #293d71;
			color: #fff;
			border-color: #21325e;
		}
	}
}
</style>