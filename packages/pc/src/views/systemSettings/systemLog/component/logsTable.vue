<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type { Key } from 'ant-design-vue/es/table/interface'
import type { ColumnsType } from 'ant-design-vue/lib/table'
import { computed, ref } from 'vue'

import { customDelay, customPaginationOptions, titleAndPaginationHeight } from '@/common/js/config'
import DynamicTooltip from '@/components/DynamicTooltip.vue'
import type { TablePageChange } from '@/interface/system/roleManage'
import type { LogsRecord } from '@/interface/system/systemLogs'
import { formatExecuteTime, formatTime } from '@/utils/format'

import { LOG_STATUS, LOG_TAG_STATUS } from '../enum'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },

  dataSource: {
    type: Array,
    default: () => [],
  },
  selectList: {
    type: Array,
    default: () => [],
  },
  paginationParam: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits(['pageChange', 'select', 'delete', 'toedit'])
const requestCellWidth = ref(150)
const columns: ColumnsType<LogsRecord> = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50,
    fixed: 'left',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'operationName',
    key: 'operationName',
    width: 120,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '操作账号',
    dataIndex: 'account',
    key: 'account',
    ellipsis: true,
    width: 120,
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    key: 'eventType',
    width: 120,
  },
  {
    title: '事件分类',
    dataIndex: 'eventCategory',
    key: 'eventCategory',
    width: 120,
  },
  {
    title: '操作内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    width: requestCellWidth.value,
  },
  {
    title: '请求地址',
    dataIndex: 'interfacePath',
    key: 'interfacePath',
    ellipsis: true,
    width: requestCellWidth.value,
  },
  {
    title: '执行时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 120,
  },
  {
    title: '执行结果',
    dataIndex: 'result',
    key: 'result',
    width: 100,
  },
  {
    title: '执行时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 150,
    fixed: 'right',
  },
]
const logsTable = ref(null)
const { height } = useElementSize(logsTable)
const scrollHeight = computed(() => {
  return height.value - titleAndPaginationHeight.logsAndRole
})

function roleSelection(selectedRowKeys: string[]) {
  emits('select', selectedRowKeys)
}

function handleTableChange({ current, pageSize: size }: TablePageChange) {
  emits('pageChange', { current, size })
}
const pagination = computed(() => ({
  total: props.total,
  current: props.paginationParam.pageNum,
  pageSize: props.paginationParam.pageSize,
  ...customPaginationOptions,
}))

function deleteLog(id: string) {
  emits('delete', [id])
}

function openInfoModal(id: string) {
  emits('toedit', id)
}
</script>

<template>
  <div ref="logsTable" class="h-[calc(100%-40px)]">
    <a-table
      size="small"
      class="bg-[#fff] py-[10px] radius-5"
      :columns="columns"
      :data-source="dataSource"
      bordered
      center
      sticky
      :loading="{ spinning: props.loading, delay: customDelay }"
      row-key="id"
      :scroll="{ x: '1000', y: scrollHeight }"
      :pagination="pagination"
      :row-selection="{
        onChange: (selectedRowKeys: Key[]) => roleSelection(selectedRowKeys as string[]),
        selectedRowKeys: props.selectList as Key[],
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, index, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button class="px-0" type="link" @click="openInfoModal(record.id)">
            详情
          </a-button>
          <a-divider v-permission="['button_system_log_delete']" type="vertical" />
          <a-button
            v-permission="['button_system_log_delete']"
            class="px-0"
            type="link"
            danger
            @click="deleteLog(record.id)"
          >
            删除
          </a-button>
        </template>
        <template v-else-if="column.dataIndex === 'index'">
          <span>{{ index + 1 + (paginationParam.pageNum - 1) * paginationParam.pageSize }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'result'">
          <a-tag :color="LOG_TAG_STATUS[text]">
            {{ LOG_STATUS[text] }}
          </a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          <span>
            {{ formatTime(text, 'YYYY-MM-DD HH:mm') }}
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'content'">
          <DynamicTooltip :width="requestCellWidth" :message="text" />
        </template>
        <template v-else-if="column.dataIndex === 'interfacePath'">
          <DynamicTooltip :width="requestCellWidth" :message="text?.substring(1)" />
        </template>
        <template v-else-if="column.dataIndex === 'requestJson'">
          <DynamicTooltip :width="requestCellWidth" :message="text" />
        </template>
        <template v-else-if="column.dataIndex === 'operationName'">
          <DynamicTooltip :width="120" :message="text" />
        </template>
        <template v-else-if="column.dataIndex === 'duration'">
          <span>
            {{ formatExecuteTime(text) }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
