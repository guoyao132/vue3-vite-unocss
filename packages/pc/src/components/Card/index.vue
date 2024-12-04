<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  loading?: boolean
}>(), {
  title: '',
  loading: false,
})

const slots = defineSlots()

const loadingState = computed(() => props.loading)
</script>

<template>
  <a-card :loading="loadingState" :title="props.title" class="rounded-6px">
    <div v-if="slots.title" class="header flex items-center">
      <slot name="title" />
    </div>
    <div class="card-body-box">
      <slot />
    </div>
  </a-card>
</template>

<style scoped lang="less">
:deep(.ant-card-head) {
  padding: 0;
  display: flex;
  align-items: center;
  min-height: 0;
  position: relative;
}

:deep(.ant-card-head-title), .header {
  height: 50px;
  padding: 0px 22px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  width: 100%;
}

:deep(.ant-card-body) {
  padding: 0px;
}

.card-body-box {
  padding: 10px;
}
</style>
