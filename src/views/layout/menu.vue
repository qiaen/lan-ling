<template>
	<menu class="menu shrink0 fcfff hideit scroll-y">
		<div class="width100 menu-logo">
			<a class="fxmiddle flex hideit height100" :class="{'menu-collapse': isCollapse}">
				<img src="@img/lan-2.png" alt="">
				<div class="fcfff pl5">
					<p class="fbold fsize14">兰陵王</p>
					<p class="fsize11">后台管理系统模版</p>
				</div>
			</a>
		</div>
		<!-- 菜单列表，默认展开，折叠信息，当前选中 在store common内配置 -->
		<el-menu :default-openeds="defaultOpeneds" :default-active="currentTab.path" background-color="#21325e" text-color="#fff" active-text-color="#fff" :collapse="isCollapse" :collapse-transition="false" :router="true">
			<template v-for="item in menus">
				<el-submenu :key="item.name" v-if="item.child && item.child.length" :index="item.path">
					<template slot="title">
						<i :class="item.icon"></i>
						<span>{{item.name}}</span>
					</template>
					<el-menu-item-group>
						<template slot="title">{{item.name}}</template>
						<el-menu-item v-for="children in item.child" :index="children.path" :key="children.name">
							<i :class="children.icon"></i>
							<span>{{children.name}}</span>
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-menu-item :key="item.name" :index="item.path" v-else>
					<i :class="item.icon"></i>
					<span>{{item.name}}</span>
				</el-menu-item>
			</template>
		</el-menu>
	</menu>
</template>
<script>
import { mapGetters } from 'Vuex'
export default {
	name: 'menu',
	data() {
		return {}
	},
	computed: {
		...mapGetters([
			'menus',
			'isCollapse',
			'currentTab',
			'defaultOpeneds'
		])
	},
	methods: {}
}
</script>
<style lang="less">
.menu {
	background: #21325e;
	.menu-logo {
		height: 50px;
		/*background: #1bc9b3;*/
		background: #293d71;
		img {
			height: 38px;
		}
		a {
			transform: translate3d(11px, 0, 0);
			&.menu-collapse {
				.fcfff {
					display: none;
				}
			}
		}
	}

	.el-menu-item-group__title {
		display: none !important;
	}
	.iconfont {
		color: #fff;
	}

}
// 作用于全局的菜单，如果有别的地方用到，可以使用弹出菜单的自定义类名属性：popper-class
.el-menu {
	border-right: none;
	.is-active {
		background-color: #409EFF !important;
	}
	.iconfont {
		margin-right: 4px;
	}
}
</style>