import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

import { layoutConfig } from '@/config/layout'

export const useTabStore = defineStore('tab', () => {
  const tabs = ref([{
    title: layoutConfig.tabConfig.homeTitle,
    path: layoutConfig.tabConfig.homePath,
    name: layoutConfig.tabConfig.homeTitle,
    closable: layoutConfig.tabConfig.homeClosable,
  }])

  const activeTab = ref(layoutConfig.tabConfig.homePath)

  function addTab(route: RouteRecordRaw) {
    if (!layoutConfig.enableTabs)
      return

    const isExist = tabs.value.some(tab => tab.path === route.path)

    if (!isExist && tabs.value.length < layoutConfig.tabConfig.maxTabCount) {
      tabs.value.push({
        title: route.name as string,
        path: route.path,
        name: route.name as string,
        closable: true,
      })
    }
    activeTab.value = route.path
  }

  function closeTab(targetPath: string) {
    const index = tabs.value.findIndex(tab => tab.path === targetPath)

    if (index !== -1) {
      tabs.value.splice(index, 1)

      if (activeTab.value === targetPath) {
        activeTab.value = tabs.value[Math.max(0, index - 1)].path
      }
    }
  }

  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    // ...其他方法
  }
})
