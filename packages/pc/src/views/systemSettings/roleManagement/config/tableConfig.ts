import { type Ref, ref } from 'vue'

import { TableColumnTypeEnum } from '@/enums'
import type { TableColumnAllType, TableConfigType } from '@/interface/table'

export const tableConfig: Ref<TableConfigType> = ref({
  rowKey: 'id',
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
const USE_STATUS_MAP: Record<string, string> = {
  0: '是',
  1: '否',
}
const USE_STATUS_TYPE_MAP: Record<string, string> = {
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
    title: '角色名称',
    align: 'center',
    fixed: 'left',
    dataIndex: 'roleName',
    width: 130,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '创建人',
    dataIndex: 'createByUsername',
    align: 'center',
    width: 130,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: 150,
    type: TableColumnTypeEnum.DATE,
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    align: 'center',
    width: 80,
    type: TableColumnTypeEnum.TAG,
    valueMap: USE_STATUS_MAP,
    typeMap: USE_STATUS_TYPE_MAP,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: 180,
    type: TableColumnTypeEnum.TOOLTIP,
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.OPERATION,
  },
]
