<template>
	<section class="checkin flex1 bgfff flex pad12 hideit" :class="'user-action-' + ua" v-loading="loading.details">
		<div class="flex1 scroll-y" ref="checkin">
			<el-steps :active="active" align-center class="pt10">
				<el-step title="选择作业类型" description="选择要执行的作业类型，总计6种"></el-step>
				<el-step title="接入源信息" description="支持多种数据源接入，注意事项说明"></el-step>
				<el-step title="输出源信息" description="输出源支持mysql、hive、es、hbase等"></el-step>
				<el-step title="复核完成" description="检查作业信息输入员与输出源是否正确"></el-step>
			</el-steps>
			<ul class="pad12 check-page">
				<!-- 选择作业类型 -->
				<types :data="form" v-show="active===1" v-if="!form.id" :active.sync="active" :load-next.sync="loadNext"></types>
				<!-- 接入源信息 -->
				<access :data="form" v-show="active===2" v-if="loadNext&&ua!='details'" :active.sync="active"></access>
				<!-- 输出源信息 满足条件时加载 -->
				<exportation :data="form" v-show="active===3" v-if="loadNext && ua!='details'" :oldData="oldData" :active.sync="active"></exportation>
				<!-- 复核完成 满足条件时加载 -->
				<complete :data="form" v-show="active===4" v-if="active > 2" :active.sync="active" :loading="loading"></complete>
			</ul>
		</div>
	</section>
</template>
<script>
import * as Task from '@api/Task'
import Mixins from '@/mixins'
// 导入 选择类型 模块
const types = () => import('./compons/checkin-type')
// 导入 接入源 模块
const access = () => import('./compons/checkin-access')
// 导入 输出信息 模块
const exportation = () => import('./compons/checkin-export')
// 导入 复核完成 模块
const complete = () => import('./compons/checkin-complete')
export default {
	components: { types, access, exportation, complete },
	name: '/task/checkin',
	// data：任务详情
	props: {
		data: { type: Object, default: {} }
	},
	mixins: [Mixins],
	data() {
		return {
			// 步骤条
			active: 1,
			// 接入源输出源表单控制
			form: {
				jobName: '',
				// 作业类型
				jobType: 'mysql2hive',
				// 目标表 数据源
				hiveDb: 'ods',
				// 调度频率
				taskMode: '',
				// 作业模式
				pullIncreType: 'day_increment',
				// 目标表
				hiveTable: '',
				// 分区信息
				hivePartition: 'pt=${day}',
				// 清洗规则
				writeMode: '',
				// 分隔键
				splitPk: '',
				// 数据过滤
				whereClause: '',
				description: '',
				// 源头表 数据源，注意这里是空格，防止编辑时触发获取表接口
				tableName: ' ',
				cron: '',
				// 字断映射数据源表
				columnName: [],
				// 字断映射数据源表
				hiveColumn: [],
				speedChannel: 3,
				errorRecord: 0,
				isCompress: 0
			},
			// 初始化的form，用户创建成功后重置表单
			initForm: {},
			loading: {
				details: true
			},
			// 字断映射数据源表
			dataTables: [],
			// 字断映射数据源表
			hiveTables: [],
			// 编辑前原数据
			oldData: {},
			// 接口请求完成标志，决定是否加载后续步骤的页面
			loadNext: false,
			// 用户行为，add，edit，details
			ua: this.data.userAction || 'add'
		}
	},
	provide() {
		return {
			scrollTop: this.scrollTop,
			back: this.back
		}
	},
	methods: {
		// 完成创建，清空form
		back() {
			this.form = { ...this.initForm }
			// 返回用户行为，编辑时只刷新当前查看页，新增时从第一页请求
			this.$emit('back', this.ua)
			this.$nextTick(() => {
				this.next(1)
			})
		},
		next(val) {
			this.active = val
		},
		// 页面向上滚动
		scrollTop(val = 160) {
			this.$refs.checkin.scrollTop = val
		}
	},
	created() {
		// 记录初始化表单
		this.initForm = { ...this.form }
		let data = this.data
		// 用户操作行为
		if (data.id) {
			// 编辑
			this.next(data.userAction === 'edit' ? 2 : 4)
			setTimeout(() => {
				this.loadNext = true
				// 后面在详情自动生成，这里暂时不需要等待
				Task.detailsById({ id: data.id }).then(res => {
					if (res.code === 200) {
						let d = res.data
						// 编辑/详情时，owner要是创建人
						d.owner = data.owner
						// 构造临时下拉选择项
						this.$store.dispatch('SetDataSource', {
							type: 'mysql',
							value: [{
								dbName: d.datasourceDb,
								name: d.datasourceName,
								id: d.datasourceId
							}]
						})
						// 浅拷贝
						this.form = { ...d }
						this.oldData = d
					} else {
						this.$message.error(res.message)
					}

					this.loading.details = false
				}).catch(err => {
					this.loading.details = false
				})
			}, 360)
		} else {
			this.loading.details = false
		}
	}
}
</script>
<style lang="less">
.checkin {
	.el-steps {
		&.is-center .el-step__description {
			padding-left: 8%;
			padding-right: 8%;
		}
	}
	// 查看详情样式
	&.user-action-details {
		// 去除折叠面板顶部线条
		.el-collapse {
			border-top: none;
		}
		.el-steps, .el-alert, .button-box {
			display: none;
		}
		.check-page {
			padding-top: 0;
		}
		.task-id {
			display: flex;
		}
	}
	.check-alert {
		width: 540px;
		margin: 0 auto;
		&.is-light {
			background-color: rgb(236, 245, 255);
			color: #409EFF;
		}
	}
	.remark {
		line-height: 1.6;
		padding: 10px 1.2% 0;
		h4 {
			padding-top: 5px;
			font-size: 15px;
		}
		p {
			color: #666;
			font-size: 13px;
		}
	}
	.task-id {
		display: none;
	}
}
</style>