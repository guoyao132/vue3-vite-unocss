import { ref } from 'vue'

import { TableColumnTypeEnum } from '@/enums'
import type { TableColumnAllType } from '@/interface/table'

export const tableConfig = ref({
  rowSelection: null,
  pagination: false,
})

export const MENU_TYPE_STATUS: Record<string, string> = {
  1: '目录',
  2: '菜单',
  3: '按钮',
}

export const MENU_TYPE_TAG_STATUS: Record<string, string> = {
  1: 'success',
  2: 'processing',
  3: 'default',
}

export const tableColumns: TableColumnAllType[] = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    align: 'center',
    fixed: 'left',
    width: 120,
    ellipsis: true,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '排序',
    dataIndex: 'sortNumber',
    align: 'center',
    ellipsis: true,
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '请求地址',
    dataIndex: 'path',
    align: 'center',
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '类型',
    dataIndex: 'permissionType',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TAG,
    valueMap: MENU_TYPE_STATUS,
    typeMap: MENU_TYPE_TAG_STATUS,
  },
  {
    title: '权限标识',
    dataIndex: 'code',
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
