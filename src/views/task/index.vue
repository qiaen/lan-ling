<template>
	<section class="task">
		<el-form :inline="true" size="small" :model="params">
			<el-form-item label="作业名称">
				<el-input v-model="params.keyword" @keyup.13.native="init" placeholder="作业名称、创建人" clearable></el-input>
			</el-form-item>
			<el-form-item label="作业类型">
				<el-select @change="init" placeholder="请选择作业类型" v-model="params.jobType" clearable>
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in serviceEnum.JOB_TYPE" :label="item.name" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="init" :loading="xoading.main" icon="el-icon-search">查询</el-button>
				<el-button v-permission="17" type="success" @click="setCurrtRow({}, 'add')"> <i class="iconfont icon-xiezi fsize12 pr5"></i>管理员可见</el-button>
			</el-form-item>
		</el-form>
		<el-table class="zm-table" height="100%" v-loading="xoading.main" :data="mainTable" border>
			<!-- <el-table-column type="index" label="序号" width="80" align="center"></el-table-column> -->
			<el-table-column prop="id" label="作业ID" width="75" align="center"></el-table-column>
			<el-table-column prop="jobName" label="作业名称" min-width="150" sortable show-overflow-tooltip>
				<template slot-scope="scope">
					<a @click="setCurrtRow(scope.row, 'operate')">
						{{scope.row.jobName}}
					</a>
				</template>
			</el-table-column>
			<el-table-column prop="increType" label="作业模式" width="110" sortable></el-table-column>
			<el-table-column prop="jobType" label="作业类型" width="105" sortable></el-table-column>
			<el-table-column prop="cron" label="执行频率" min-width="130" show-overflow-tooltip>
				<template slot-scope="scope">
					{{scope.row.taskMode == 0 ? '一次性任务' : scope.row.cron}}
				</template>
			</el-table-column>
			<el-table-column prop="targetTable" label="目标表名称" min-width="190" sortable show-overflow-tooltip></el-table-column>
			<el-table-column prop="owner" label="创建人" width="88" sortable show-overflow-tooltip></el-table-column>
			<el-table-column prop="runStatus" label="运行状态" width="90">
				<template slot-scope="scope">
					<span class="tag-status-circle" :class="'tag-status-'+ scope.row.runStatus"></span>{{matchEnum('SCHEDULE_STATUS', scope.row.runStatus)}}
				</template>
			</el-table-column>
			<el-table-column label="生命周期" align="center" width="100">
				<template slot-scope="scope">
					<span class="tag-status" :class="'tag-cycle-'+ scope.row.lifeCycle">{{scope.row.lifeCycle == 0?'测试':'上线'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="是否启用" align="center">
				<template slot-scope="scope">
					<el-switch @change="changeTaskStatus(scope.row)" v-model="scope.row.isDisable" :active-value="0" :inactive-value="1" active-color="#13ce66" inactive-color="#ff4949">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column prop="jobBu" label="业务方" width="100" sortable></el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="160" sortable></el-table-column>
			<el-table-column prop="updateTime" label="更新时间" width="160" sortable></el-table-column>
			<el-table-column fixed="right" label="操作" width="160">
				<template slot-scope="scope">
					<el-button @click="setCurrtRow(scope.row, 'details')" type="text" size="small">查看</el-button>
					<el-button @click="setCurrtRow(scope.row, 'test')" type="text" size="small">{{scope.row.lifeCycle == 0?'上线':'测试'}}</el-button>
					<el-dropdown>
						<span class="el-dropdown-link">
							更多<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="setCurrtRow(scope.row, 'edit')">
								编辑
							</el-dropdown-item>
							<el-dropdown-item @click.native="setCurrtRow(scope.row, 'run')">
								设定时间
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class="pt15 txright" @size-change="sizeChange" @current-change="pageChange" :current-page="pageInfo.pageNo" :page-sizes="pageInfo.sizes" :page-size="pageInfo.pageSize" :layout="pageInfo.layout" :total="pageInfo.total">
		</el-pagination>
		<!-- 作业查看，编辑，新增 -->
		<drawer :open.sync="dialog.add" @back="backEditTask" :title="currtRow.jobName">
			<checkin :data="currtRow" slot="left" :user-action="dialog.add" @back="backEditTask"></checkin>
		</drawer>
		<!-- 生成作业 -->
		<task-run @back="get()" :loading="loading" :dialog="dialog" :data="currtRow"></task-run>
	</section>
</template>
<script>
import Enum from '@configs/enum'
import * as Task from '@api/Task'
import Mixins from '@/mixins'
const checkin = () => import('./checkin')
const taskRun = () => import('./compons/task-run')
// import taskRun from './compons/task-run'
export default {
	name: '/task',
	mixins: [Mixins],
	components: { checkin, taskRun },
	data() {
		return {
			taskType: Enum.taskType,
			taskStatus: Enum.taskStatus,
			params: {
				keyword: '',
				jobType: ''
			},
			loading: {
				run: false
			},
			// 单击编辑选中的行
			currtRow: {},
			dialog: {
				// 编辑，新增，添加作业
				add: false,
				// 生成实例
				run: false
			}
		}
	},
	methods: {
		// 改变作业状态
		changeTaskStatus(row) {
			this.$confirm(`确定${row.isDisable?'禁用':'启用'}作业 “${row.jobName}” ？`).then(() => {
				this.xoading.main = true
				Task.changeStatus({
					id: row.id,
					isDisable: row.isDisable
				}).then(res => {
					this.xoading.main = false
					if (res.code === 200) {
						this.$message.success(res.message || '操作成功！')
						this.get()
					} else {
						this.$message.error(res.message)
						row.isDisable = row.isDisable ? 0 : 1
					}
				}).catch(err => {
					this.xoading.main = false
					row.isDisable = row.isDisable ? 0 : 1
				})
			}).catch(() => {
				row.isDisable = row.isDisable ? 0 : 1
			})

		},
		// 设定单击编辑选中的行
		setCurrtRow(row, type) {
			this.currtRow = { ...row, userAction: type }
			if (['edit', 'add', 'details'].includes(type)) {
				this.dialog.add = type
			}
			// 生成实例
			if (type === 'run') {
				this.dialog.run = true
			}
			// 作业运维
			if (type === 'operate') {
				this.$store.dispatch('SetTaskCurrtRow', row)
				this.$router.push('/task/operate')
			}
			// 测试上线
			if (type === 'test') {
				this.$confirm(`作业“${row.jobName}”确定执行${row.lifeCycle?'测试':'上线'}操作 ？`).then(() => {
					this.xoading.main = true
					Task.changeStatus({
						id: row.id,
						lifeCycle: row.lifeCycle ? 0 : 1
					}).then(res => {
						this.xoading.main = false
						if (res.code === 200) {
							this.$message.success(res.message || '操作成功！')
							this.get()
						} else {
							this.$message.error(res.message)
						}
					}).catch(err => {
						this.xoading.main = false
					})
				}).catch(() => {})
			}
		},
		// 从新增/编辑作业页面返回，编辑时只刷新当前查看页，新增时从第一页请求
		backEditTask(val) {
			this.dialog.add = false
			switch (val) {
				case 'add':
					this.init()
					break
				case 'edit':
					this.get()
					break
			}
		},
		get() {
			this.xoading.main = true
			Task.getList({
				...this.params,
				pageNo: this.pageInfo.pageNo,
				pageSize: this.pageInfo.pageSize
			}).then(res => {
				this.xoading.main = false
				if (res.code === 200) {
					this.mainTable = res.data
					this.pageInfo.total = res.total
				} else {
					this.$message.error(res.message)
				}

			}).catch(err => {
				this.xoading.main = false
			})
		},
		// 删除任务
		deleteById({ id, jobName }) {
			this.$confirm(`确定删除作业 “${jobName}” 吗？`).then(() => {
				Task.deleteById(id).then(res => {
					if (res.code === 200) {
						this.get()
					} else {
						this.$message.error(res.message)
					}
				}).catch(err => {

				})
			}).catch(() => {})
		}
	},
	created() {
		this.init()
	}
}
</script>
<style lang="less">
</style>