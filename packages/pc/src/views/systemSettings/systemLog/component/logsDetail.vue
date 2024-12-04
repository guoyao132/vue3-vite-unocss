<script setup lang="ts">
import { ref, watch } from 'vue'

import { formatTime } from '@/utils/format'

import { LOG_STATUS } from '../enum'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits(['close'])
const logsVisible = ref<boolean>(false)
watch(
  () => props.visible,
  (val) => {
    logsVisible.value = val
  },
)

const handleCancel = () => {
  emits('close')
}
</script>

<template>
  <a-modal
    v-model:open="logsVisible"
    width="50%"
    :mask-closable="false"
    centered
    :footer="null"
    @cancel="handleCancel"
  >
    <a-descriptions title="日志详情 " bordered>
      <a-descriptions-item label="姓名">
        {{ props.data.operationName }}
      </a-descriptions-item>
      <a-descriptions-item label="操作账号" :span="2">
        {{ props.data.account }}
      </a-descriptions-item>
      <a-descriptions-item label="事件类型">
        {{ props.data.eventType }}
      </a-descriptions-item>
      <a-descriptions-item label="事件分类" :span="2">
        {{ props.data.eventCategory }} {{ props.data.abnormalEventDescribe ? `(${props.data.abnormalEventDescribe})` : '' }}
      </a-descriptions-item>
      <a-descriptions-item label="操作内容" :span="3">
        {{ props.data.content }}
      </a-descriptions-item>
      <a-descriptions-item label="请求地址" :span="3">
        {{ props.data.interfacePath?.substring(1) }}
      </a-descriptions-item>
      <a-descriptions-item label="执行时长(毫秒)">
        {{ props.data.duration }}
      </a-descriptions-item>
      <a-descriptions-item label="IP地址" :span="2">
        {{ props.data.ip }}
      </a-descriptions-item>
      <a-descriptions-item label="执行结果">
        <a-tag :color="props.data.result ? 'error' : 'success'">
          {{ LOG_STATUS[props.data.result] }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="执行时间" :span="2">
        {{ formatTime(props.data.createTime, 'YYYY-MM-DD HH:mm') }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
