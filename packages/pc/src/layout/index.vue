<script setup lang="ts">
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface'
import { computed, ref } from 'vue'
import { type RouteRecordRaw, useRoute } from 'vue-router'

import { logOut } from '@/api/login'
import { layoutConfig } from '@/config/layout'
import useUser from '@/hooks/useUser'
import MenuItems from '@/layout/menuItems.vue'
import router, { routerList } from '@/router'
import { useSecretKeyStore } from '@/stores/secretKey'
import { useTabStore } from '@/stores/tabs'
import { clearCookie } from '@/utils/format'
import './index.less'

// 抽取路由处理逻辑
function useRoutes() {
  const filterHiddenRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] =>
    routes.filter(route => !route.meta?.isHide)

  const traverseRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] =>
    routes.map(route => ({
      ...route,
      children: route.children ? traverseRoutes(route.children as RouteRecordRaw[]) : [],
    }))

  const currentRouterList = computed(() => filterHiddenRoutes(traverseRoutes(routerList)))

  return { currentRouterList }
}

// 抽取登录状态处理逻辑
function useLogout() {
  const handleLogOut = async () => {
    const [, err] = await to(logOut())

    if (!err) {
      sessionStorage.clear()
      clearCookie()

      if (import.meta.env.MODE === 'build') {
        window.location.href = 'http://portalnew.cq.sgcc.com.cn/up/pweb/desktop/pweb/login/logout'
      }
      else {
        router.replace({ path: '/login' })
      }
    }
    else {
      message.error(err.message)
    }
  }

  return { handleLogOut }
}

// 使用组合式函数
const currentRoute = useRoute()
const { user } = useUser()
const { SecretKey, changeSecretKeyStore } = useSecretKeyStore()
const { currentRouterList } = useRoutes()
const { handleLogOut } = useLogout()
const tabStore = useTabStore()

// 处理折叠按钮点击事件
const handleCollapsed = () => {
  changeSecretKeyStore('isCollapsed', !SecretKey.isCollapsed)
}

// 计算选中的菜单项
const selectedKeys = computed(() => {
  const paths = currentRoute.path.split('/')
  return [paths[paths.length - 1]]
})

// 计算面包屑数据
const breadcrumb = computed(() =>
  currentRoute.matched.map(item => ({
    breadcrumbName: item.name,
    path: item.path,
    isStop: false,
  })),
)

// 管理菜单展开项
const openKeysArr = ref<string[]>([])
const rootSubmenuKeys = ref(routerList.map(item => item.path))

// 根据当前路由计算需要展开的菜单
const initOpenKeys = () => {
  const paths = currentRoute.path.split('/')
  const parentPath = `/${paths[1]}`
  openKeysArr.value = [parentPath]
}
// 在组件挂载时初始化展开的菜单
onMounted(() => {
  initOpenKeys()
})

// 监听路由变化，动态更新展开的菜单
watch(
  () => currentRoute.path,
  () => {
    initOpenKeys()
  },
)

// 处理菜单点击事件
const handleClickMenuItem: MenuClickEventHandler = (obj) => {
  router.push(obj.keyPath?.join('/') ?? '')
}

// 处理菜单展开变化
const handleOpenChange = (openKeys: (string | number)[]) => {
  const latestOpenKey = openKeys.find(key => !openKeysArr.value.includes(key as string))

  if (!rootSubmenuKeys.value.includes((latestOpenKey as string) ?? '')) {
    openKeysArr.value = openKeys.map(key => key as string)
  }
  else {
    openKeysArr.value = latestOpenKey ? [latestOpenKey.toString()] : []
  }
}

// 处理页签编辑(关闭)
const onEdit = (targetKey: string | MouseEvent, action: 'add' | 'remove') => {
  if (action === 'remove' && typeof targetKey === 'string') {
    tabStore.closeTab(targetKey)
    router.push(tabStore.activeTab)
  }
}

// 处理页签点击
const handleTabClick = (key: string) => {
  router.push(key)
}
const appTitle = import.meta.env.VITE_APP_TITLE
</script>

<template>
  <a-layout class="text-dark-900 min-h-100vh">
    <a-layout-sider
      v-model:collapsed="SecretKey.isCollapsed"
      :width="200"
      :collapsed-width="60"
      class="rounded-none main-sidebar"
    >
      <div class="sidebar-title">
        <GithubOutlined class="text-[#333333]" />
        <span v-if="!SecretKey.isCollapsed">{{ appTitle }}</span>
      </div>
      <div class="sidebar-content">
        <a-menu
          :open-keys="openKeysArr"
          mode="inline"
          theme="light"
          :selected-keys="selectedKeys"
          class="border-0"
          @click="handleClickMenuItem"
          @openChange="handleOpenChange"
        >
          <MenuItems :menu-list="currentRouterList" />
        </a-menu>
        <div class="collapse-button" @click="handleCollapsed">
          <MenuFoldOutlined v-if="!SecretKey.isCollapsed" :style="{ color: '#000000' }" />
          <MenuUnfoldOutlined v-else :style="{ color: '#000000' }" />
        </div>
      </div>
    </a-layout-sider>
    <a-layout class="layout-base">
      <a-layout-header class="layout-base-header flex items-center justify-between">
        <a-breadcrumb :routes="breadcrumb as any" separator=">">
          <template #itemRender="{ route }">
            <span>{{ route.breadcrumbName }}</span>
          </template>
        </a-breadcrumb>
        <a-popover placement="bottomRight">
          <template #content>
            <a-button type="link" @click="handleLogOut">
              退出登录
            </a-button>
          </template>
          <div class="user-info">
            {{ user?.accountUserInfo.name ?? '匿名用户' }}
          </div>
        </a-popover>
      </a-layout-header>
      <a-layout-content class="layout-base-container">
        <!-- 根据配置显示页签 -->
        <div v-if="layoutConfig.enableTabs" class="tabs-wrapper bg-white px-2 py-1">
          <a-tabs
            v-model:active-key="tabStore.activeTab"
            hide-add
            type="editable-card"
            @edit="onEdit as any"
            @tab-click="handleTabClick as any"
          >
            <a-tab-pane
              v-for="tab in tabStore.tabs"
              :key="tab.path"
              :tab="tab.title"
              :closable="tab.closable"
            />
          </a-tabs>
        </div>

        <!-- 路由视图 -->
        <router-view v-slot="{ Component }">
          <keep-alive v-if="layoutConfig.tabConfig.keepAlive">
            <component :is="Component" />
          </keep-alive>
          <component :is="Component" v-else />
        </router-view>
      </a-layout-content>
      <a-layout-footer>
        <CopyRight />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout-base-header {
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
}

.layout-base-container {
  overflow-y: auto;
  padding: 0 24px;
}

.sidebar-title {
  width: 100%;
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 1.25rem;
}

.sidebar-content {
  height: calc(100vh - 65px);
  overflow-y: auto;
  position: relative;
}

.collapse-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  right: 1.125rem;
  bottom: 1.125rem;
  background-color: #f7f8fa;
  cursor: pointer;
}

.user-info {
  font-size: 1rem;
  margin-right: 0.625rem;
  color: #00706b;
}
</style>
