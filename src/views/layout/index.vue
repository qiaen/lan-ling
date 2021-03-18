<template>
	<div class="layout full-content hideit flex">
		<!-- 左侧菜单 -->
		<menus class="menu shrink0"></menus>
		<!-- 右侧主内容区域 -->
		<main class="main flex-view hideit">
			<!-- 头部 -->
			<!-- 顶部功能区 -->
			<roof class="shrink0 layout-roof"></roof>
			<!-- 主内容 -->
			<div class="content relative hideit flex-view">
				<tabs></tabs>
				<!-- <transition :name="$route.meta.fast ? '' : 'fade-transform'"> -->
				<!-- <transition name="fade-transform" @before-leave="setTransition(true)" @after-enter="setTransition(false)"> -->
				<transition name="fade-transform">
					<!-- 页面缓存，注意事项看下方 cachedViews -->
					<keep-alive :include="cachedViews">
						<router-view class="bgfff main-content absolute flex-view"></router-view>
					</keep-alive>
				</transition>
			</div>
		</main>
	</div>
</template>
<script>
import menus from './menu'
import tabs from './tabs'
import roof from './roof'
import { mapGetters } from 'Vuex'
export default {
	components: { menus, tabs, roof },
	name: 'layout',
	data() {
		return {
			transiting: false
		}
	},
	computed: {
		// keep-alive识别的是组件名称而非路由名称，页面缓存异常请检查页面name是否重复或未与对应的路由一致
		...mapGetters([
			'isCollapse', 'cachedViews'
		])
	},
	methods: {
		setTransition(val) {
			this.transiting = val
		}
	}
}
</script>
<style lang="less">
@import "../../assets/css/var.less";
// 页面切换中，隐藏抽屉
.transiting {
	.drawer-bg {
		display: none;
	}
}
.layout {
	.topbar {
		height: 50px;
		padding: 0 15px;
		border-bottom: 1px solid #ddd;
	}
	.content {
		background: #f1f5f9 url("../../assets@{main-bg}") no-repeat bottom right;
	}
	.main-content {
		top: 50px;
		right: 15px;
		bottom: 15px;
		left: 15px;
		padding: 15px;
		z-index: 10;
	}
	.layout-roof {
		height: 50px;
		border-bottom: 1px solid #dedede;
	}
}
</style>