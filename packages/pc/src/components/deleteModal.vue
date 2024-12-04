<script lang="ts" setup>
import debounce from 'lodash/debounce'
import { ref, watch } from 'vue'

import { customDelay } from '@/common/js/config'

export interface DelayLoading {
  delay: number
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '删除操作',
  },
  message: {
    type: String,
    default: '你确定需要删除此数据么？',
  },
  hint: {
    type: String,
    default: '此数据删除后将无法恢复，请谨慎操作。',
  },
})

const emits = defineEmits(['cancel', 'confirm'])

const delayLoading = ref<false | DelayLoading>(false)

function handleCancel() {
  emits('cancel')
}

function handleConfirm() {
  emits('confirm')
}
const debounceConfirm = debounce(handleConfirm, 500, { leading: true, trailing: false })

watch(
  () => props.loading,
  (loading) => {
    if (loading)
      delayLoading.value = { delay: customDelay }
    else
      delayLoading.value = false
  },
)
</script>

<template>
  <div>
    <a-modal :z-index="2000" :open="visible" :title="title" :mask-closable="false" width="30%" @cancel="handleCancel">
      <template #default>
        <p class="text-[16px]">
          {{ message }}
        </p>
        <p class="mt-[10px] text-[#aaa]">
          {{ hint }}
        </p>
      </template>
      <template #footer>
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" ghost danger :loading="delayLoading" @click="debounceConfirm">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
