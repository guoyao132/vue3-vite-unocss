<script setup lang="ts">
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { RouterView } from 'vue-router'
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#00706b',
        colorPrimaryBg: '#9fd4c8',
        colorSuccess: '#5ec76f',
        colorWarning: '#efb33f',
        colorError: '#ec655f',
        colorInfo: '#00706b',
        borderRadius: 4,
        wireframe: true,
      } }"
  >
    <RouterView />
  </a-config-provider>
</template>
