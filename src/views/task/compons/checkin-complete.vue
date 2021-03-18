<template>
	<li class="checkin-complete">
		<el-alert class="check-alert" title="复核时请仔细检查输入源与输出源是否配置正确。" :closable="false" show-icon>
		</el-alert>
		<el-collapse v-model="activeNames" @change="handleChange">
			<el-collapse-item name="1">
				<template slot="title">
					<sline title="基本信息" size="big"></sline>
				</template>
				<ul class="basic-ul fxwrap flex">
					<li class="flex flex1">
						<label>作业名称：</label>
						<p>{{data.jobName}}</p>
					</li>
					<li class="flex flex1 task-id">
						<label>任务ID：</label>
						<p>{{data.actionId}}</p>
					</li>
					<li class="flex flex1">
						<label>作业类型：</label>
						<p>{{data.jobType}}</p>
					</li>
					<li class="flex flex1">
						<label>所属业务方：</label>
						<p>{{data.jobBu}}</p>
					</li>
					<li class="flex flex1">
						<label>所属人：</label>
						<p>{{data.id ? data.owner : userInfo.name}}</p>
					</li>
					<li class="flex flex1" style="max-width: 66.66%">
						<label>作业需求描述：</label>
						<p>{{data.description}}</p>
					</li>
				</ul>
			</el-collapse-item>
			<el-collapse-item name="2">
				<template slot="title">
					<sline title="数据源信息" size="big"></sline>
				</template>
				<div class="flex source-info">
					<div class="flex1">
						<p class="pl20 fbold fcgreen fsize14">接入源信息</p>
						<ul class="basic-ul fxwrap">
							<li class="flex flex1">
								<label>数据源：</label>
								<p>
									MySQL | {{data.datasourceName}}
								</p>
							</li>
							<li class="flex flex1">
								<label>数据库名：</label>
								<p>{{data.datasourceDb}}</p>
							</li>
							<li class="flex flex1">
								<label>表名称：</label>
								<p>{{data.tableName}}</p>
							</li>
							<li class="flex flex1">
								<label>数据过滤：</label>
								<p>{{data.whereClause}}</p>
							</li>
							<li class="flex flex1">
								<label>作业模式：</label>
								<p>{{matchEnum('PULL_INCRE_TYPE', data.pullIncreType)}}</p>
							</li>
							<li class="flex flex1">
								<label>分隔键：</label>
								<p>{{data.splitPk}}</p>
							</li>
						</ul>
					</div>
					<div class="flex1">
						<p class="pl20 fbold fcgreen fsize14">输出源信息</p>
						<ul class="basic-ul fxwrap">
							<li class="flex flex1">
								<label>数据源：</label>
								<p>Hive | {{data.hiveDb}}</p>
							</li>
							<li class="flex flex1">
								<label>目标表：</label>
								<p>{{data.hiveTable}}</p>
							</li>
							<li class="flex flex1">
								<label>分区信息：</label>
								<p>{{data.hivePartition}}</p>
							</li>
							<li class="flex flex1">
								<label>清洗规则：</label>
								<p>{{matchEnum('MYSQL_WRITE_MODE',data.writeMode)}}</p>
							</li>
							<li class="flex flex1">
								<label>调度频率：</label>
								<p>{{data.taskMode == 0?'一次性任务':`周期性任务 | ${data.cron}`}}</p>
							</li>
							<li class="flex flex1">
								<div class="flex" style="width: 160px">
									<label>同步并发数：</label>
									<p>{{data.speedChannel}}</p>
								</div>
								<div class="flex">
									<label style="min-width: 120px">允许同步错误数：</label>
									<p>{{data.errorRecord}}</p>
								</div>
								<div class="flex flex1">
									<label style="max-width: 70px">压缩：</label>
									<p>{{data.isCompress?'压缩':'不压缩'}}</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>
		<checkin-map :data="data" :active="active" :loading="loading" :passed.sync="passed" style="margin-top: 1px;"></checkin-map>
		<div class="center flex pt15 button-box">
			<el-button type="primary" size="small" @click="next(3)" :disabled="loading.submit">上一步</el-button>
			<el-button type="primary" size="small" @click="submit" icon="el-icon-s-promotion">保存</el-button>
		</div>
	</li>
</template>
<script>
import * as Task from '@api/Task'
import Mixins from '@/mixins'
// 源头表目标表映射
const checkinMap = () => import('./checkin-map')
export default {
	props: ['active', 'data', 'loading'],
	inject: ['scrollTop', 'back'],
	name: 'checkin-complete',
	mixins: [Mixins],
	components: { checkinMap },
	data() {
		return {
			activeNames: ['1', '2']
		}
	},
	methods: {
		next(val) {
			this.$emit('update:active', val)
		},
		submit() {
			this.loading.details = true
			Task.save(this.data).then(res => {
				if (res.code == 0) {
					this.$message.success(`作业${this.data.id?'编辑':'创建'}成功！`)
					this.back()
				} else {
					this.$message.error(res.message)
				}
				this.loading.details = false
			}).catch(err => {
				this.loading.details = false
			})
		}
	}
}
</script>
<style lang="less">
.checkin-complete {
	.check-alert {
		margin-bottom: 15px;
	}
	.form-line {
		margin-left: 1.2%;
		width: 98%;
	}
	.basic-ul>li {
		width: 33.33%;
		max-width: 33.33%;
		label {
			width: 100px;
			min-width: 100px;
			text-align: right;
			color: #999;
		}
		.el-tag {
			background-color: #29b87a;
			border: none;
			color: #fff;
			height: 20px;
			padding: 0 6px;
			line-height: 20px;
		}
	}
	.source-info {
		li {
			width: 100%;
			max-width: 100%;
		}
		label {
			width: 90px;
			min-width: 90px;
		}
	}
}
</style>