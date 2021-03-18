<!-- 修改作业运维状态 -->
<template>
	<el-dialog title="实例状态修改" :visible.sync="dialog.changeStatus" class="zm-dialog task-status" width="500px" :before-close="closeThisDialog" append-to-body>
		<section v-loading="loading.changeStatus">
			<el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
				<el-form-item label="作业状态" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio :label="1">成功</el-radio>
						<el-radio :label="3">失败</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="" class="">
					<p class="lineh16 fc999 fsize13">
						i.不会检查前后置作业实例，强制修改
					</p>
					<p class="lineh16 fc999 fsize13">
						ii.相同状态不会重复修改
					</p>
					<p class="lineh16 fc999 fsize13">
						iii.运行中的作业实例不能修改状态
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
					this.$emit('changeStatus', 'changeStatus', this.form.status)
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
