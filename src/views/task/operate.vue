<template>
	<section class="operate">
		<!-- 筛选条件，折叠+展开 -->
		<filters size="small">
			<template slot="show">
				<el-form-item label="用户名">
					<el-input v-model="params.actionSid" @keyup.13.native="init" placeholder="用户名" clearable></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select @change="init" placeholder="请选择用户状态" v-model="params.status" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in serviceEnum.USER_STATUS" :label="item.name" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
			</template>
			<template slot="auto">
				<el-form-item label="邮箱地址">
					<el-input v-model="params.name" @keyup.13.native="init" placeholder="邮箱地址" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户身份">
					<el-select @change="init" placeholder="请选择作业类型" v-model="params.status" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in serviceEnum.USER_POSITION" :label="item.name" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker @change="init" v-model="params.date" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 380px">
					</el-date-picker>
				</el-form-item>
			</template>
			<template slot="button">
				<el-button type="primary" @click="init" :loading="xoading.main" icon="el-icon-search">查询</el-button>
				<el-button :disabled="mainSelected.length < 1" type="primary" @click="operateByType('rerun')" :loading="loading.rerun" icon="el-icon-refresh-right">重跑</el-button>
				<el-button :disabled="mainSelected.length < 1" type="primary" @click="operateByType('del')" :loading="loading.del" icon="el-icon-delete">删除</el-button>
				<el-button :disabled="mainSelected.length < 1" type="primary" @click="operateByType('changeStatus')" :loading="loading.changeStatus" icon="el-icon-thumb">状态修改</el-button>
			</template>
		</filters>
		<el-table @selection-change="mainSelectionChange" class="zm-table" height="100%" v-loading="xoading.main" :data="mainTable" border>
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column prop="id" label="用户ID" width="90" align="" show-overflow-tooltip></el-table-column>
			<el-table-column prop="name" label="用户名" min-width="120" sortable show-overflow-tooltip></el-table-column>
			<el-table-column prop="status" label="状态" width="90">
				<template slot-scope="scope">
					<span class="tag-status-circle" :class="'tag-status-'+ scope.row.status"></span>{{matchEnum('USER_STATUS', scope.row.status)}}
				</template>
			</el-table-column>
			<el-table-column prop="phoneNumber" label="手机号" width="140" align="" show-overflow-tooltip></el-table-column>
			<el-table-column prop="email" label="邮箱地址" min-width="160" sortable></el-table-column>
			<el-table-column prop="position" label="身份信息" min-width="160" sortable></el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="160" sortable></el-table-column>
			<el-table-column fixed="right" label="操作" width="125">
				<template slot-scope="scope">
					<el-button @click="setCurrtRow(scope.row, 'log')" type="text" size="small">查看日志</el-button>
					<el-button :disabled="scope.row.status != 2" @click="setCurrtRow(scope.row, 'cancel')" type="text" size="small">取消</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class="pt15 txright" @size-change="sizeChange" @current-change="pageChange" :current-page="pageInfo.pageNo" :page-sizes="pageInfo.sizes" :page-size="pageInfo.pageSize" :layout="pageInfo.layout" :total="pageInfo.total">
		</el-pagination>
		<!-- 运维日志 -->
		<operate-log :loading="loading" :dialog="dialog" :data="currtRow"></operate-log>
		<!-- 修改运维状态 -->
		<operate-status @changeStatus="doByType" :loading="loading" :dialog="dialog" :data="currtRow"></operate-status>
	</section>
</template>
<script>
import Enum from '@configs/enum'
import * as Users from '@api/Users'
import Mixins from '@/mixins'
const operateLog = () => import('./compons/operate-log')
const operateStatus = () => import('./compons/operate-status')
export default {
	name: '/task/operate',
	mixins: [Mixins],
	components: { operateLog, operateStatus },
	data() {
		return {
			taskType: Enum.taskType,
			taskStatus: Enum.taskStatus,
			params: {
				actionId: '',
				status: '',
				name: '',
				date: [],
				actionSid: ''
			},
			loading: {
				rerun: false,
				del: false,
				changeStatus: false,
				cancel: false
			},
			// 单击编辑选中的行
			currtRow: {},
			dialog: {
				add: false,
				log: false,
				changeStatus: false
			},
			showall: false,
			// 重跑：成功，失败
			// 删除：成功，失败
			// 修改状态：初始化，成功，失败
			// 取消：运行中
			operateType: {
				// 功能｜接受的状态｜状态验证失败提示文字
				rerun: ['重跑', [1, 3], '成功，失败'],
				del: ['删除', [1, 3], '成功，失败'],
				changeStatus: ['修改状态', [0, 1, 3], '初始化，成功，失败'],
				cancel: ['取消', [2], '运行中']
			},
			actionSids: []
		}
	},
	methods: {
		// 获取已选择的某个状态的数据，状态是数组类型
		matchMainSeled(status) {
			let s = this.mainSelected.filter(item => status.includes(item.status)).map(item => item.actionSid)
			return s
		},
		// 改变作业状态，删除，重跑在这里校验状态
		operateByType(type) {
			let lo = this.loading
			if (lo.rerun || lo.changeStatus || this.xoading.main || lo.del) {
				return this.$message.warning('正在执行其他操作，请稍后！')
			}
			let ms = this.mainSelected
			let ot = this.operateType[type]
			let actionSids = this.matchMainSeled(ot[1])
			if (actionSids.length != ms.length) {
				return this.$message.warning(`只有${ot[2]}状态的作业才能执行${ot[0]}操作!`)
			}
			// 存储选择的参数
			this.actionSids = actionSids
			if (type === 'changeStatus') {
				// 修改状态会在这里走下一步
				this.dialog.changeStatus = true
			} else {
				// 删除，重跑会在这里执行下一步
				this.$confirm(`确定${ot[0]}选中的${ms.length}个作业吗？`).then(() => {
					this.doByType(type)
				}).catch(() => {})
			}
		},
		// 根据状态执行相对应的操作
		doByType(type, status) {
			let p = { actionSids: this.actionSids }
			if (type === 'changeStatus') {
				p.status = status
				type = 'changeStatus'
			}
			this.loading[type] = true
			Schedule[type](p).then(res => {
				// 把修改状态的弹出层也顺便关了
				this.dialog.changeStatus = this.loading[type] = false
				if (res.code == 0) {
					this.get()
					this.$message.success(res.message || '操作成功！')
				} else {
					this.$message.error(res.message)
				}
			}).catch(err => {
				this.dialog.changeStatus = this.loading[type] = false
			})
		},
		// 设定单击编辑选中的行
		setCurrtRow(row, type) {
			this.currtRow = row
			// 查看日志
			if (['log'].includes(type)) {
				this.dialog.log = true
			}
			// 取消
			if (type === 'cancel') {
				this.$confirm(`确定取消实例“${row.name}”吗？`).then(() => {
					this.xoading.main = true
					Schedule.cancel(row.actionSid).then(res => {
						this.xoading.main = false
						if (res.code == 0) {
							this.get()
							this.$message.success(res.message || '操作成功！')
						} else {
							this.$message.error(res.message)
						}
					}).catch(err => {
						this.xoading.main = false
					})
				}).catch(() => {})
			}
		},
		// 从新增/编辑作业页面返回
		backEditTask(val) {
			this.dialog.add = false
			if (val) {
				this.init()
			}
		},
		get() {
			let p = {
				...this.params,
				pageNo: this.pageInfo.pageNo,
				pageSize: this.pageInfo.pageSize
			}
			if (p.date && p.date.length === 2) {
				p.startDate = p.date[0]
				p.endDate = p.date[1]
			}
			this.xoading.main = true
			Users.getList(p).then(res => {
				this.xoading.main = false
				if (res.code == 200) {
					this.mainTable = res.data
					this.pageInfo.total = res.total
				} else {
					this.$message.error(res.msg)
				}

			}).catch(err => {
				this.xoading.main = false
			})
		},
		// 删除任务
		deleteById({ id, name }) {
			this.$confirm(`确定删除数据源 “${name}” 吗？`).then(() => {
				Users.del(id).then(res => {
					if (res.code == 0) {
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
.operate {
	.zm-filter {
		.el-input {
			width: 170px;
		}
	}
}
</style>