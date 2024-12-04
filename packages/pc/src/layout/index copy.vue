<script setup lang="ts">
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface'
import { computed, ref } from 'vue'
import { type RouteRecordRaw, useRoute } from 'vue-router'

import { logOut } from '@/api/login'
import useUser from '@/hooks/useUser'
import router, { routerList } from '@/router'
import { useSecretKeyStore } from '@/stores/secretKey'
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
const openKeysArr = ref([routerList[0].path])
const rootSubmenuKeys = ref(routerList.map(item => item.path))

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
</script>

<template>
  <a-layout class="text-dark-900 min-h-100vh">
    <a-layout-sider
      v-model:collapsed="SecretKey.isCollapsed" :width="200" :collapsed-width="60"
      class="rounded-none main-sidebar"
    >
      <div class="sidebar-title">
        <GithubOutlined class="text-[#333333]" />
        <span v-if="!SecretKey.isCollapsed">数字基建平台</span>
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
          <template v-for="item in currentRouterList" :key="item.path">
            <a-sub-menu v-if="item.children && !item.meta?.isHide" :key="item.path">
              <template #icon>
                <component :is="item.meta?.icon" />
              </template>
              <template #title>
                {{ item.name }}
              </template>
              <a-menu-item v-for="menuChild in item.children" :key="menuChild.path">
                <span>{{ menuChild.name }}</span>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else-if="!item.meta?.isHide && item.component" :key="item.name">
              <span>{{ item.name }}</span>
            </a-menu-item>
          </template>
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
        <router-view v-slot="{ Component }">
          <component :is="Component" />
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
