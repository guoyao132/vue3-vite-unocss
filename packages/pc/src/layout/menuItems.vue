<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

interface Props {
  menuList: RouteRecordRaw[]
}

defineProps<Props>()
</script>

<template>
  <template v-for="item in menuList" :key="item.path">
    <template v-if="item.children?.length && !item.meta?.isHide">
      <a-sub-menu :key="item.path">
        <template #icon>
          <component :is="item.meta?.icon" />
        </template>
        <template #title>
          {{ item.name }}
        </template>
        <MenuItems :menu-list="item.children ?? []" />
      </a-sub-menu>
    </template>
    <a-menu-item v-else-if="!item.meta?.isHide && item.component" :key="item.path">
      <span>{{ item.name }}</span>
    </a-menu-item>
  </template>
</template>

<style scoped lang="less">

</style>
