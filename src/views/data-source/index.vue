<template>
	<section class="data-sources">
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
				<el-button type="primary" @click="setCurrtRow({}, 'edit')" icon="el-icon-plus">新增</el-button>
				<el-button :disabled="mainSelected.length < 1" type="primary" @click="dialog.changeStatus = true" :loading="loading.changeStatus" icon="el-icon-thumb">状态修改</el-button>
			</template>
		</filters>
		<el-table @selection-change="mainSelectionChange" class="zm-table" height="100%" v-loading="xoading.main" :data="mainTable" border>
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column prop="status" label="头像" width="60">
				<template slot-scope="scope">
					<div class="center" style="vertical-align: middle;">
						<img :src="scope.row.avatar" alt="" width="30" height="30">
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="用户名" min-width="120" sortable show-overflow-tooltip></el-table-column>
			<el-table-column prop="status" label="状态" width="90">
				<template slot-scope="scope">
					<span class="tag-status-circle" :class="'tag-status-'+ scope.row.status"></span>{{matchEnum('USER_STATUS', scope.row.status)}}
				</template>
			</el-table-column>
			<el-table-column prop="phoneNumber" label="手机号" width="140" align="" show-overflow-tooltip></el-table-column>
			<el-table-column prop="email" label="邮箱地址" min-width="160" sortable></el-table-column>
			<el-table-column prop="position" label="身份信息" min-width="120" sortable>
				<template slot-scope="scope">
					{{matchEnum('USER_POSITION', scope.row.position)}}
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" min-width="160" sortable></el-table-column>
			<el-table-column fixed="right" label="操作" width="125">
				<template slot-scope="scope">
					<el-button @click="setCurrtRow(scope.row, 'edit')" type="text" size="small">编辑</el-button>
					<el-button @click="setCurrtRow(scope.row, 'del')" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class="pt15 txright" @size-change="sizeChange" @current-change="pageChange" :current-page="pageInfo.pageNo" :page-sizes="pageInfo.sizes" :page-size="pageInfo.pageSize" :layout="pageInfo.layout" :total="pageInfo.total">
		</el-pagination>
		<drawer :open.sync="dialog.add" @back="backEdit">
			<user-edit :data="currtRow" slot="left" v-if="dialog.add" @back="backEdit"></user-edit>
		</drawer>
		<!-- 修改运维状态 -->
		<change-status @changeStatus="doByType" :loading="loading" :dialog="dialog" :data="mainSelected"></change-status>
	</section>
</template>
<script>
import Enum from '@configs/enum'
import * as Users from '@api/Users'
import Mixins from '@/mixins'
// 编辑+新增用户
const userEdit = () => import('./compons/user-edit')
// 批量修改用户状态
const changeStatus = () => import('./compons/change-status')
export default {
	name: '/datasource',
	mixins: [Mixins],
	components: { userEdit, changeStatus },
	data() {
		return {
			taskType: Enum.taskType,
			taskStatus: Enum.taskStatus,
			params: {
				keyword: '',
				type: ''
			},
			dialog: {
				add: false,
				changeStatus: false
			},
			// 单击编辑选中的行
			currtRow: {},
			loading: {
				changeStatus: false
			}
		}
	},
	methods: {
		// 从改变状态页面返回
		doByType(val) {
			if (val == 1) {
				this.$message.success(`你点击了启用，模拟操作，不会真的改变数据`)
			} else {
				this.$message.info(`你点击了禁用，模拟操作，不会真的改变数据`)
			}
			this.get()
			console.log(this.mainSelected.map(item => item.id))
			this.dialog.changeStatus = this.loading.changeStatus = false
		},
		// 改变数据源状态
		changeDataSourceStatus(row) {
			this.$confirm(`确定${row.status?'启用':'禁用'} “${row.name}” ？`).then(() => {
				this.xoading.main = true
				DataSource.save({
					id: row.id,
					status: row.status
				}).then(res => {
					this.xoading.main = false
					if (res.code == 0) {
						this.$message.success('操作成功！')
						this.get()
					} else {
						this.$message.error(res.message)
						row.status = row.status ? 0 : 1
					}
				}).catch(err => {
					this.xoading.main = false
					row.status = row.status ? 0 : 1
				})
			}).catch(() => {
				row.status = row.status ? 0 : 1
			})

		},
		// 设定单击编辑选中的行
		setCurrtRow(row, type) {
			this.currtRow = row
			if (['edit', 'add'].includes(type)) {
				this.dialog.add = type
			}
			if (type === 'del') {
				this.$message.info('这个按钮只有管理员可以看到')
			}
		},
		// 从新增/编辑数据源页面返回
		backEdit(val) {
			if (val) {
				if (this.dialog.add == 'add') {
					this.init()
				}
				if (this.dialog.add == 'edit') {
					this.get()
				}
			}
			this.dialog.add = false
		},
		get() {
			this.xoading.main = true
			Users.getList({
				keyword: this.params.keyword,
				pageNo: this.pageInfo.pageNo,
				pageSize: this.pageInfo.pageSize
			}).then(res => {
				this.xoading.main = false
				if (res.code == 200) {
					this.mainTable = res.data
					this.pageInfo.total = res.total
				} else {
					this.$message.error(res.message)
				}
			}).catch(err => {
				this.xoading.main = false
			})
		},
		// 删除数据源
		deleteById({ id, name }) {
			this.$confirm(`确定删除数据源 “${name}” 吗？`).then(() => {
				DataSource.deleteById(id).then(res => {
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
<style>
</style>