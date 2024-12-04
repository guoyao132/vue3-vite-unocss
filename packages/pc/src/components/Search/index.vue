<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  searchLoading?: boolean
  resetLoading?: boolean
  isInline?: boolean
  expand?: boolean
}>(), {
  searchLoading: false,
  resetLoading: false,
  isInline: true,
  expand: false,
})
const emit = defineEmits(['search', 'reset'])
const searchLoading = computed(() => props.searchLoading)
const resetLoading = computed(() => props.resetLoading)
const [expand, changeExpand] = useToggle(false)
watch(() => props.expand, (val) => {
  changeExpand(val)
})

function searchQueryEvent() {
  emit('search')
}

function resetQueryEvent() {
  emit('reset')
}
</script>

<template>
  <div
    class="transition"
    :class="{
      isInlineClass: props.isInline,
      isNotExpandClass: !expand,
    }
    "
  >
    <slot />
    <div class="flex justify-end ml-20px">
      <a-space :size="15" justify="center">
        <a-button v-if="props.expand" class="h-40px w-60px flex justify-center items-center p-0 text-16px " @click="changeExpand()">
          {{ expand ? '收起' : '展开' }}
        </a-button>
        <a-button :loading="resetLoading" class="h-40px min-w-86px text-16px" @click="resetQueryEvent">
          重置
        </a-button>
        <a-button :loading="searchLoading" type="primary" class="h-40px min-w-86px text-16px" @click="searchQueryEvent">
          查询
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<style scoped lang="less">
.isInlineClass{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  line-height: 42px;
  transition: all 0.5s;
}
.isNotExpandClass{
  height: 42px;
  overflow: hidden;
}
</style>
