<script setup lang="ts">
import { useScreenSafeArea } from '@vueuse/core'
import { RouterLink } from 'vue-router'

import { RouteToName } from '@/common/js/route-to-name'

const { bottom } = useScreenSafeArea()
</script>

<template>
  <div class="filter w-full fixed pb-20px bottom-0" :style="{ 'padding-bottom': `${bottom || 0}` }">
    <van-space class="w-full flex justify-center py-12px text-8px">
      <div class="text-[#666B75] w-25vw">
        <RouterLink
          class="flex flex-col justify-center text-center"
          :to="{ name: RouteToName.index }"
          :replace="true"
          active-class="text-[#07b899]"
        >
          <van-icon name="smile-o" class="mb-4px !text-sm" />
          工作台
        </RouterLink>
      </div>
    </van-space>
  </div>
</template>

<style scoped lang="less">
.filter {
  background-color: @text-white;
  box-shadow: 0px -3px 4px 0px rgba(212, 227, 252, 0.2);
}
</style>
