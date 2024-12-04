<script setup lang="ts">
import { computed } from 'vue'

import { modalsDefaultConfig } from './modalsDefaultConfig'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    config?: Record<string, any>
  }>(),
  {
    modelValue: false,
    title: undefined,
    config: () => ({}),
  },
)
const emit = defineEmits(['cancel'])
const title = computed(() => props.title)
const config = computed(() =>
  Object.assign({}, modalsDefaultConfig, props.config),
)
const visible = computed(() => props.modelValue)
</script>

<template>
  <div class="bg-[#ffffff]">
    <a-modal
      :open="visible"
      :title="title"
      v-bind="config"
      destroy-on-close
      @cancel="emit('cancel')"
    >
      <template #title>
        <slot name="title" />
      </template>
      <slot />
      <template #footer>
        <slot name="footer" />
      </template>
    </a-modal>
  </div>
</template>
