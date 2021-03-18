<template>
	<section v-loading="loading.test || loading.submit" class="source-edit bgfff pad12">
		<sline class="plr15" :title="(form.id?'编辑':'新增')+'用户信息'" size="big"></sline>
		<el-form class="flex fxwrap" ref="form" :rules="rules" :inline="true" :model="form" size="small" label-width="100px">
			<el-form-item label="用户名称" prop="name">
				<el-input v-model="form.name" placeholder="请输入用户名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户类型" prop="position">
				<el-select class="width100" placeholder="请选择用户类型" v-model="form.position">
					<el-option v-for="item in serviceEnum.USER_POSITION" :label="item.name" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" placeholder="请输入邮箱" clearable></el-input>
			</el-form-item>
			<el-form-item label="数据库名称" prop="dbName">
				<el-input v-model="form.dbName" placeholder="请输入数据库名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="phoneNumber">
				<el-input v-model="form.phoneNumber" placeholder="请输入手机号" clearable></el-input>
			</el-form-item>
			<el-form-item label="端口号" prop="dbPort">
				<el-input v-model="form.dbPort" placeholder="端口号，不填写则默认3306" clearable></el-input>
			</el-form-item>
			<el-form-item label="连接驱动类" prop="dbDriver">
				<el-select class="width100" placeholder="请选择连接驱动类" v-model="form.dbDriver">
					<el-option v-for="item in serviceEnum.DATASOURCE_DRIVER" :label="item.name" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" :placeholder="'请输入密码' + (form.id?'，编辑时密码可不填':'')" type="password" autocomplete="false" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户身份" prop="position" required>
				<el-radio-group v-model="form.position">
					<el-radio label="admin">管理员</el-radio>
					<el-radio label="normal">普通用户</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="紧急联系人" prop="dbAdmin">
				<el-input v-model="form.dbAdmin" placeholder="请输入数据库紧急联系人" clearable></el-input>
			</el-form-item>
			<el-form-item style="width:100%" label="描述说明" prop="descript">
				<el-input type="textarea" v-model="form.descript" placeholder="请输入用户描述信息" style="width: 89.2%;" clearable></el-input>
			</el-form-item>
			<el-form-item style="width:100%" label=" ">
				<el-button type="primary" :loading="loading.submit" @click="submit" icon="el-icon-s-promotion">保存</el-button>
				<el-button @click="reset" icon="el-icon-refresh">重置</el-button>
			</el-form-item>
		</el-form>
		<div class="center flex">
		</div>
	</section>
</template>
<script>
import Mixins from '@/mixins'
import * as DataSource from '@api/DataSource'
export default {
	components: {},
	name: 'source-edit',
	mixins: [Mixins],
	props: ['data'],
	data() {
		return {
			form: {
				name: '',
				dbUser: '',
				dbIp: '',
				dbName: '',
				dbPort: '3306',
				password: '',
				dbParams: '',
				serviceType: '抽取',
				dbDriver: '',
				bu: '',
				position: 'normal',
				dbAdmin: '',
				descript: ''
			},
			// 是否测试通过
			passed: false,
			loading: {
				test: false,
				submit: false
			},
			rules: {
				name: { required: true, message: '请填写用户名称', trigger: 'blur' },
				position: { required: true, message: '请选择用户类型', trigger: 'change' },
				bu: { required: true, message: '请选择所属业务方', trigger: 'change' },
				dbIp: { required: true, message: '请填写用户链接', trigger: 'blur' },
				dbName: { required: true, message: '请填写数据库名称', trigger: 'blur' },
				dbUser: { required: true, message: '请填写用户名', trigger: 'blur' },
				dbDriver: { required: false, message: '请选择连接驱动类', trigger: 'change' },
				password: { required: true, message: '请输入密码', trigger: 'blur' }
			}
		}
	},
	methods: {
		// 创建和更新用户
		submit() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.loading.submit = true
					DataSource.save(this.form).then(res => {
						if (res.code == 0) {
							this.passed = true
							this.$message.success('操作成功！')
							this.$emit('back', true)
						} else {
							this.$message.error(res.message)
						}
						this.loading.submit = false
					}).catch(err => {
						this.loading.submit = false
					})
				}
			})
		},
		// 重置
		reset() {
			this.$refs.form.resetFields()
		}
	},
	async mounted() {
		if (this.data.id) {
			this.form = { ...this.data }
			this.rules.password.required = false
		}
	}
}
</script>
<style lang="less">
.source-edit {
	.el-form {
		padding: 15px 9%;
	}
	.el-form-item {
		width: 45%;
		display: flex !important;
		.el-input {
			width: 94%;
		}
		display: flex;
		.el-form-item__content {
			flex-grow: 1;
		}
	}
}
</style>