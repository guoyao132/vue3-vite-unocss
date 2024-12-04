<script setup lang="ts">
import cls from 'classnames'
import { computed } from 'vue'

defineOptions({
  name: 'SvgIcon',
})

const props = withDefaults(
  defineProps<{
    /** icon 的前缀 */
    prefix?: string
    /** icon 名称 */
    name: string
    /** icon 的尺寸 */
    size?: IconSize | number | null
    /** icon的样式 */
    class?: string
  }>(),
  {
    name: '',
    prefix: '#icon-',
    size: null,
    color: 'default',
    class: '',
  },
)

export type IconSize = 'default' | 'small' | 'large'

const sizeMap: Record<IconSize, number> = {
  default: 70,
  small: 60,
  large: 80,
}

const sizeRef = computed(() => {
  if (typeof props.size === 'string')
    return sizeMap[props.size]
  return props.size
})
</script>

<template>
  <svg
    v-if="size" :style="{ width: `${sizeRef}px`, height: `${sizeRef}px` }"
    :class="cls('svg-icon-wrapper', '', props.class)"
  >
    <use :xlink:href="prefix + name" />
  </svg>
  <svg v-else :class="cls('svg-icon-wrapper', props.class)">
    <use :xlink:href="prefix + name" />
  </svg>
</template>

<style>
.svg-icon-wrapper {
  display: inline-block;
}
</style>
