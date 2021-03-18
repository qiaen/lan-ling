<template>
	<el-container class="jy-service-login">
		<el-main class="main">
			<el-form ref="form" label-position="right" label-width="80px" :model="form" :rules="rules">
				<el-form-item label="选择身份">
					<el-radio-group v-model="eve" @change="change">
						<el-radio-button label="管理员"></el-radio-button>
						<el-radio-button label="普通用户"></el-radio-button>
						<el-radio-button label="帐号封禁"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="账号" prop="email">
					<el-input v-model="form.email" placeholder="请输入帐号"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
					<p class="fcred fsize14">集成动态路由，权限管理，登录不同身份，看到的菜单和按钮略有不同</p>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" :loading="loading" @click="login" icon="el-icon-s-promotion">{{loading ? '登录中...' : '登录'}}</el-button>
				</el-form-item>
			</el-form>
		</el-main>
	</el-container>
</template>
<script>
import * as Account from '@api/Account'
import Storage from '@utils/Storage'
export default {
	name: '/login',
	data() {
		return {
			eve: '管理员',
			loading: false,
			form: {
				email: 'admin@qq.com',
				password: '123456'
			},
			rules: {
				email: { required: true, message: '请填写邮箱地址', trigger: 'blur' },
				password: { required: true, message: '请填写密码', trigger: 'blur' }
			}
		}
	},
	methods: {
		// 登录
		login() {
			let p = {
				password: this.form.password,
				email: this.form.email,
			}
			this.loading = true
			Account.login(p).then(res => {
				this.loading = false
				if (res.code == 200) {
					this.$message.success('登录成功！')
					Storage.set('token', res.data)
					// 关闭login页面
					this.$store.dispatch('RemoveTab', { path: '/login' }).then(() => {
						// 跳转到登陆
						this.$router.replace('/')
					})
				} else {
					this.$message.error(res.message || res.msgContent || '登陆有误，请打开控制台查看错误信息')
				}
			}).catch(err => {
				this.$message.error(err)
				this.loading = false
			})
		},
		// 选择身份
		change(val) {
			if (val === '管理员') {
				this.form = this.$options.data().form
			} else if (val === '普通用户') {
				this.form = {
					email: 'normal@qq.com',
					password: '123456'
				}
			} else {
				this.form = {
					email: 'forbid@qq.com',
					password: '123456'
				}
			}
		}
	}
}
</script>
<style lang="less">
.login {
	li {
		margin: 10px 12px;
		border-bottom: 1px dashed #ddd;
	}
	li input {
		padding: 10px 12px;
		font-size: 16px;
		width: 92%;
	}
	div button {
		width: 80%;
		margin-left: 10%;
		margin-top: 30px;
		font-size: 18px;
		background: #090;
		color: #fff;
		height: 40px;
		border-bottom: none;
	}
}
</style>