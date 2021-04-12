<template>
	<div class="flex">
		<!-- 面包屑，折叠菜单 -->
		<div class="flex1 hideit fxmiddle bread">
			<i @click="collapse" :style="{'transform': `rotate(${isCollapse ? 0 : 180}deg)`}" class="iconfont icon-zhankai middle fsize20 pointer"></i>
			<el-breadcrumb separator="/">
				<el-breadcrumb-item to="/">首页</el-breadcrumb-item>
				<el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
					<router-link :to="item.path">{{item.name}}</router-link>
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- 头像，退出登录 -->
		<div class="flex avatar">
			<div class="middle">
				{{userInfo.name||''}}
			</div>
			<el-dropdown class="fxmiddle" @command="logout">
				<a class="middle acc-avatar pointer el-dropdown-link">
					<img :src="userInfo.avatar" alt="">
				</a>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="a" icon="el-icon-switch-button">
						退出登录
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'Vuex'
export default {
	name: 'roof',
	data() {
		return {
			breadcrumb: []
		}
	},
	computed: {
		...mapGetters([
			'isCollapse', 'userInfo'
		])
	},
	methods: {
		...mapActions(['Logout', 'SetMenuCollapse']),
		// 伸展菜单
		collapse() {
			this.SetMenuCollapse(!this.isCollapse)
		},
		// 面包屑
		mthBread() {
			let route = this.$route
			this.breadcrumb = route.path == '/' ? [] : [route]
		},
		// 退出登录
		logout(val) {
			if (val === 'a') {
				this.Logout().then(() => {
					this.$router.push('/login')
				})
			}
		}
	},
	watch: {
		'$route'(to) {
			this.mthBread()
		}
	},
	mounted() {
		this.mthBread()
	}
}
</script>
<style lang="less">
.layout-roof {
	.icon-zhankai {
		width: 46px;
		height: 100%;
	}
	.avatar {
		justify-content: flex-end;
		&>div {
			padding: 0 10px;
		}
		min-width: 40%;
		max-width: 40%;
		padding-right: 15px;
		.acc-avatar img {
			width: 32px;
			height: 32px;
			background-color: #f1f5f9;
			border-radius: 32px;
		}
	}
}
</style>