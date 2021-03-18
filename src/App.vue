<template>
  <div id="app" class="full-content hideit" :class="{'full-collapse': isCollapse}">
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'Vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters([
      // 控制菜单宽度，抽屉向左移动距离
      'isCollapse'
    ])
  }
}
</script>
<style lang="less">
// 默认菜单宽度
.menu {
  width: 215px;
}

// 菜单折叠后的样式和宽度
.full-collapse {
  .menu {
    width: 60px;
  }
}
</style>