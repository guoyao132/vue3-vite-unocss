<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import type { ColumnType } from 'ant-design-vue/lib/table'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { ref, watch } from 'vue'

import { customDelay } from '@/common/js/config'
import type { StatisticsParam } from '@/interface/system/systemLogs'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['cancel', 'search'])
const hackValue = ref<Dayjs[]>([])
const [countVisible, countToggle] = useToggle()
const columns: ColumnType[] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    customRender: ({ index }: { index: number }) => {
      return index + 1
    },
  },
  {
    title: '姓名',
    dataIndex: 'operationName',
    key: 'operationName',
    width: 80,
  },
  {
    title: '操作账号',
    dataIndex: 'account',
    key: 'account',
    width: 100,
  },
  {
    title: '成功登录次数',
    dataIndex: 'successfulLoginNum',
    key: 'successfulLoginNum',
    width: 70,
  },
  {
    title: '失败登录次数',
    dataIndex: 'failedLoginNum',
    key: 'failedLoginNum',
    width: 70,
  },
]
const param = ref<StatisticsParam>({
  executeStartTime: null,
  executeEndTime: null,
})
watch(
  () => props.visible,
  (val) => {
    countToggle(val)
  },
)

function handleCancel() {
  hackValue.value = []
  param.value = {
    executeStartTime: null,
    executeEndTime: null,
  }
  countToggle(false)
  emits('cancel')
}

function onChange(val: [Dayjs, Dayjs] | [string, string]) {
  if (val) {
    hackValue.value = val
    param.value.executeStartTime = dayjs(
      dayjs(hackValue.value[0]).format('YYYY-MM-DD 00:00:00'),
    ).valueOf()
    param.value.executeEndTime = dayjs(
      dayjs(hackValue.value[1]).format('YYYY-MM-DD 23:59:59'),
    ).valueOf()
  }
}

function reset() {
  hackValue.value = []
  param.value = {
    executeStartTime: null,
    executeEndTime: null,
  }
  emits('search', param.value)
}

function submit() {
  emits('search', param.value)
}
</script>

<template>
  <div>
    <a-modal
      v-model:open="countVisible"
      title="统计"
      :mask-closable="false"
      width="50%"
      :footer="null"
      @cancel="handleCancel"
    >
      <div class="flex justify-between mb-2">
        <div>
          执行时间：
          <a-range-picker :value="hackValue" allow-clear format="YYYY-MM-DD" @change="onChange" />
        </div>
        <a-space>
          <a-button type="primary" ghost size="small" class="mr-[7px]" @click="submit">
            查询
          </a-button>
          <a-button type="link" class="flex items-center" size="small" @click="reset">
            重置
          </a-button>
        </a-space>
      </div>
      <a-table
        size="small"
        bordered
        sticky
        :columns="columns"
        :data-source="props.data"
        :pagination="false"
        :loading="{ spinning: props.loading, delay: customDelay }"
        :scroll="{ y: 400 }"
      />
    </a-modal>
  </div>
</template>
