import { type Ref, ref } from 'vue'

import { TableColumnTypeEnum } from '@/enums'
import type { TableColumnAllType, TableConfigType } from '@/interface/table'

export const tableConfig: Ref<TableConfigType> = ref({
  scroll: {
    x: '100%',
    y: '45vh',
    scrollToFirstRowOnChange: true,
  },
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
    dataIndex: 'name',
    align: 'center',
    fixed: 'left',
    width: 80,
    ellipsis: true,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: 'i国网账号',
    dataIndex: 'account',
    align: 'center',
    ellipsis: true,
    width: 100,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '所属组织',
    dataIndex: 'orgTreePathName',
    align: 'center',
    width: 130,
    type: TableColumnTypeEnum.TOOLTIP,
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '有限期',
    dataIndex: 'validDate',
    align: 'center',
    width: 130,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginDate',
    align: 'center',
    width: 130,
    fixed: 'right',
    type: TableColumnTypeEnum.TEXT,
  },
]
