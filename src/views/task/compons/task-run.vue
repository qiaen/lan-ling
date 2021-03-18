<!-- 生成实例 -->
<template>
	<el-dialog :title="'生成实例 - ' + data.jobName" :visible.sync="dialog.run" class="zm-dialog task-run" width="560px" :before-close="closeThisDialog" append-to-body>
		<section v-loading="loading.submit">
			<el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
				<el-form-item label="开始时间" prop="startDate">
					<el-date-picker v-model="form.startDate" :picker-options="pickerStart" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间" style="width: 100%;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="endDate">
					<el-date-picker v-model="form.endDate" :picker-options="pickerEnd" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间" style="width: 100%;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="" class="">
					<p class="lineh16 fc999 fsize13">
						i.选择时间范围(数据时间)
					</p>
					<p class="lineh16 fc999 fsize13">
						ii.此任务的数据时间如果在这个范围内则生成任务实例
					</p>
					<p class="lineh16 fc999 fsize13">
						iii.该时间范围内如果已存在对应作业不会重复生成
					</p>
				</el-form-item>
				<el-form-item label=" " class="txright">
					<el-button @click="dialog.run = false">取 消</el-button>
					<el-button @click="submit" type="primary" icon="el-icon-s-promotion">确定</el-button>
				</el-form-item>
			</el-form>
		</section>
	</el-dialog>
</template>
<script>
import * as Task from '@api/Task'
import * as Base from '@api/Base'
export default {
	props: ['data', 'dialog'],
	name: 'checkin-table',
	data() {
		return {
			// 开始时间禁用项
			pickerStart: {
				disabledDate: (time) => {
					if (this.form.endDate) {
						return time.getTime() > new Date(this.form.endDate).getTime() || time.getTime() < new Date(this.form.endDate).getTime() - 2678400000
					} else {
						return false
					}
				}
			},
			// 结束时间禁用项
			pickerEnd: {
				disabledDate: (time) => {
					if (this.form.startDate) {
						return time.getTime() < new Date(this.form.startDate).getTime() || time.getTime() > new Date(this.form.startDate).getTime() + 2678400000
					} else {
						return false
					}
				}
			},
			loading: {
				submit: false
			},
			// 主题下拉菜单
			themesList: [],
			form: {
				startDate: '',
				endDate: ''
			},
			rules: {
				startDate: { required: true, message: '请选择开始时间', trigger: 'blur' },
				endDate: { required: true, message: '请选择结束时间', trigger: 'blur' }
			}
		}
	},
	methods: {
		// 一键建表
		submit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					let p = {
						actionId: this.data.actionId,
						...this.form
					}
					if (new Date(p.startDate) > new Date(p.endDate)) {
						return this.$message.warning('开始时间不能晚于结束时间！')
					}
					if (new Date(p.endDate) - new Date(p.startDate) > 2678400000) {
						return this.$message.warning('运行时间间隔不能超多一个月！')
					}
					this.loading.submit = true
					Task.runSchedule(p).then(res => {
						this.loading.submit = false
						if (res.code == 0) {
							this.back(true)
							this.$message.success(res.message || '操作成功！')
							this.$refs.form.resetFields()
						} else {
							this.$message.error(res.message)
						}
					}).catch(err => {
						this.loading.submit = false
						this.$message.error(err)
					})
				}
			})
		},
		// 返回到上一步，关掉dialog
		back(val) {
			this.dialog.run = false
			this.$emit('back', val)
		},
		// 关闭创建表之前判断是否正在请求接口
		closeThisDialog(done) {
			if (this.loading.submit) {
				this.$message.warning('正在生成实例，请稍等。')
			} else {
				done()
			}
		}
	}
}

</script>
<style lang="less">
.task-run {
	.el-form {
		padding: 15px 8%;
	}
	// 第三个，文字提示
	.el-form-item--small.el-form-item:nth-child(3) .el-form-item__content {
		margin-left: 40px !important
	}
	.el-form-item--small.el-form-item:last-child {
		margin-bottom: 0px;
		margin-top: 30px;
	}
}

</style>
