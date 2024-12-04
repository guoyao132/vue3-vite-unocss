import { type Ref, ref } from 'vue'

import { TableColumnTypeEnum } from '@/enums'
import type { TableColumnAllType, TableConfigType } from '@/interface/table'

export const tableConfig: Ref<TableConfigType> = ref({
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  },
})

export const LOG_STATUS: Record<string, string> = {
  0: '成功',
  1: '失败',
}

export const LOG_TAG_STATUS: Record<string, string> = {
  0: 'success',
  1: 'error',
}

export const tableColumns: TableColumnAllType[] = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    align: 'center',
    width: 70,
    type: TableColumnTypeEnum.INDEX,
  },
  {
    title: '姓名',
    dataIndex: 'operationName',
    align: 'center',
    fixed: 'left',
    width: 120,
    ellipsis: true,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '操作账号',
    dataIndex: 'account',
    align: 'center',
    ellipsis: true,
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    align: 'center',
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '事件分类',
    dataIndex: 'eventCategory',
    align: 'center',
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '操作内容',
    dataIndex: 'content',
    align: 'center',
    ellipsis: true,
    width: 150,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '请求地址',
    dataIndex: 'interfacePath',
    align: 'center',
    ellipsis: true,
    width: 150,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '执行时长',
    dataIndex: 'duration',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    align: 'center',
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '执行结果',
    dataIndex: 'result',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TAG,
    valueMap: LOG_STATUS,
    typeMap: LOG_TAG_STATUS,
  },
  {
    title: '执行时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 160,
    type: TableColumnTypeEnum.DATE,
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 150,
    type: TableColumnTypeEnum.OPERATION,
  },
]
