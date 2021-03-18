<!-- 一键建表 -->
<template>
	<el-dialog title="一键建表" :visible.sync="dialog.createTable" class="zm-dialog" width="700px" :before-close="closeThisDialog" append-to-body>
		<section class="checkin-table" v-loading="loading.submit">
			<el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
				<el-form-item label="表名" required>
					<el-input v-model="data.hiveTable" placeholder="请输入表名" :disabled="true"></el-input>
					<p class="fsize12 fc999">快速建表会同时生成测试库(test_ods)和生产库(ods)的hive表</p>
				</el-form-item>
				<el-form-item label="主题" prop="themes">
					<el-cascader @focus="metadataSuperList" class="width100" :options="themesList" v-model="form.themes" :placeholder="loading.themes?'加载中.....':'请选择主题'" clearable>
					</el-cascader>
				</el-form-item>
				<el-form-item label="分区设置" prop="datasourceId">
					<div class="flex el-input el-input--small el-input-group el-input-group--prepend">
						<div style="width: 130px" class="el-input-group__prepend center shrink0">
							<el-select class="width100" v-model="form.partition" placeholder="无分区" clearable>
								<el-option label="pt string" value="pt string"></el-option>
								<el-option label="pt string,hour string" value="pt string,hour string"></el-option>
							</el-select>
						</div>
						<div class="flex1">
							<el-input v-model="form.customPartition" placeholder="多个分区以','分隔(格式：字段名 字段类型)" clearable></el-input>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input type="textarea" v-model="form.description" placeholder="请输入描述信息" clearable></el-input>
				</el-form-item>
				<el-form-item label=" " class="txright">
					<el-button @click="back()">取 消</el-button>
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
			loading: {
				submit: false,
				// 获取主题
				themes: false
			},
			// 主题下拉菜单
			themesList: [],
			form: {
				partition: 'pt string',
				customPartition: '',
				themes: '',
				description: ''
			},
			rules: {
				themes: { required: true, message: '请选择主题', trigger: 'change' },
				description: { required: true, message: '请输入描述信息', trigger: 'blur' }
			}
		}
	},
	methods: {
		// 一键建表
		submit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					let d = this.data
					let f = this.form
					if (!d.hiveTable) { return this.message.warning('缺少表名称！') }
					let p = {
						hiveDb: d.hiveDb,
						datasourceId: d.datasourceId,
						tableName: d.tableName,
						hiveTableName: d.hiveTable,
						...f
					}
					this.loading.submit = true
					Task.createHiveTable(p).then(res => {
						this.loading.submit = false
						if (res.code == 0) {
							this.back(true)
							this.$message.success(res.message || '创建成功！')
							this.$refs.form.clearValidate()
						} else {
							this.$message.error(res.message || '创建失败！')
						}
					}).catch(err => {
						this.loading.submit = false
						this.$message.error(err)
					})
				}
			})
		},
		// 获取源数据主题下拉菜单
		metadataSuperList() {
			if (this.themesList.length > 1) { return }
			this.loading.themes = true
			Base.metadataSuperList().then(res => {
				if (res.code == 0) {
					this.themesList = res.data
				} else {
					this.$message.error(res.message)
				}
				this.loading.themes = false
			}).catch(err => {
				this.$message.error(err)
				this.loading.themes = false
			})
		},
		// 返回到上一步，关掉dialog
		back(val) {
			this.$emit('back', val)
		},
		// 关闭创建表之前判断是否正在请求接口
		closeThisDialog(done) {
			if (this.loading.submit) {
				this.$message.warning('正在执行一键建表，请稍后。。。')
			} else {
				done()
			}
		}
	}
}
</script>
<style lang="less">
.checkin-table {
	.el-form {
		padding: 15px 7%;
	}
	.form-line {
		margin: 0 1.2%;
	}
	.el-input-group__prepend {
		padding: 0;
	}
	.el-input-group__prepend {
		div.el-select .el-input__inner {
			border-color: #409EFF;
			background-color: #409EFF;
			color: #fff;
			border-radius: 3px 0 0 3px;
		}
		input::-webkit-input-placeholder {
			color: #ddd;
		}
		.el-select .el-input .el-select__caret {
			color: #fff;
		}
	}
	.el-form-item--small.el-form-item:last-child, .el-form-item--small.el-form-item:first-child {
		margin-bottom: 0px;
	}

}
</style>