<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 300,
  },
})

const ghostMessage = ref<HTMLDivElement>()
const toolTipVisible = ref(false)

onMounted(() => {
  isTooltip()
})

function isTooltip() {
  const nodeWidth = ghostMessage.value?.clientWidth
  if (nodeWidth && nodeWidth > props.width - 10)
    toolTipVisible.value = true
}
</script>

<template>
  <div v-if="!toolTipVisible" class="ant-table-cell-ellipsis relative">
    {{ props.message }}
    <div ref="ghostMessage" class="absolute top-0 opacity-0 pointer-events-none">
      {{ props.message }}
    </div>
  </div>
  <a-tooltip v-else placement="topLeft">
    <template #title>
      {{ props.message }}
    </template>
    <div class="text">
      {{ props.message }}
    </div>
  </a-tooltip>
</template>

<style>
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
