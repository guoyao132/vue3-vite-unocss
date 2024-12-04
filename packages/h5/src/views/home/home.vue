<script setup lang="ts">
import { useElementSize, useScreenSafeArea } from '@vueuse/core'
import { setToastDefaultOptions } from 'vant'
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const router = useRouter()

const tabBarRef = ref()
const { height } = useElementSize(tabBarRef)
const { bottom } = useScreenSafeArea()
const include = computed(() => {
  return router.options.routes.forEach((item: any) => {
    if (item.meta.keepalive)
      return item.name
  })
})
setToastDefaultOptions({
  className: 'popClass',
})
</script>

<template>
  <div :style="{ height: `calc(100vh - ${height}px - ${bottom || '0px'})` }">
    <RouterView v-slot="{ Component }" class="h-full">
      <keep-alive :include="include!">
        <component :is="Component" />
      </keep-alive>
    </RouterView>
  </div>

  <TabBar v-if="route.meta?.tabBar" ref="tabBarRef" />
</template>

<style></style>
