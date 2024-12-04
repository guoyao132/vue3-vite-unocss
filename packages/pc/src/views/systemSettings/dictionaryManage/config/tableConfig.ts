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

export const USE_STATUS: Record<string, string> = {
  0: '正常',
  1: '停用',
}

export const USE_TAG_STATUS: Record<string, string> = {
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
    title: '字典名称',
    dataIndex: 'dictName',
    align: 'center',
    fixed: 'left',
    width: 120,
    ellipsis: true,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    align: 'center',
    ellipsis: true,
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TAG,
    valueMap: USE_STATUS,
    typeMap: USE_TAG_STATUS,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 120,
    type: TableColumnTypeEnum.DATE,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: 160,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 150,
    type: TableColumnTypeEnum.OPERATION,
  },
]
