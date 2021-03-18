<!-- 修改作业运维状态 -->
<template>
	<el-dialog title="批量状态修改" :visible.sync="dialog.changeStatus" class="zm-dialog task-status" width="500px" :before-close="closeThisDialog" append-to-body>
		<section v-loading="loading.changeStatus">
			<el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
				<el-form-item label="用户状态" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio :label="0">禁用</el-radio>
						<el-radio :label="1">启用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" class="">
					<p class="lineh16 fc999 fsize13">
						i.不会检查当前用户状态，强制修改
					</p>
					<p class="lineh16 fc999 fsize13">
						ii.相同状态不会重复修改
					</p>
					<p class="lineh16 fc999 fsize13">
						iii.管理员帐号例外，将会被跳过
					</p>
				</el-form-item>
				<el-form-item label=" " class="txright">
					<el-button @click="dialog.changeStatus = false">取 消</el-button>
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
	props: ['loading', 'dialog'],
	name: 'checkin-table',
	data() {
		return {
			// 主题下拉菜单
			themesList: [],
			form: {
				status: ''
			},
			rules: {
				status: { required: true, message: '请选择状态', trigger: 'change' }
			}
		}
	},
	methods: {
		// 一键建表
		submit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.loading.changeStatus = true
					// 模拟延迟操作
					setTimeout(() => {
						this.$emit('changeStatus', this.form.status)
					}, 1000)

				}
			})
		},
		// 关闭创建表之前判断是否正在请求接口
		closeThisDialog(done) {
			if (this.loading.changeStatus) {
				this.$message.warning('正在修改实例状态，请稍等。')
			} else {
				done()
			}
		}
	}
}
</script>
<style lang="less">
.task-status {
	.el-form {
		padding: 15px 8%;
	}
	// 第三个，文字提示
	.el-form-item--small.el-form-item:nth-child(2) .el-form-item__content {
		margin-left: 40px !important
	}
	.el-form-item--small.el-form-item:last-child {
		margin-bottom: 0px;
		margin-top: 30px;
	}
}
</style>