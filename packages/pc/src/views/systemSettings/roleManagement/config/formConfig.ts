import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import { FormColumnTypeEnum } from '@/enums'
import type { FormColumnType, FormConfigType } from '@/interface/form'

export const headerConfig: FormConfigType = {
  row: {
    gutter: [16, 24],
  },
  col: {
    sm: {
      span: 24,
    },
    md: {
      span: 12,
    },
    lg: {
      span: 8,
    },
    xl: {
      span: 6,
    },
  },
  isEmbedded: true,
  hasValidator: false,
}

export const headerColumns: FormColumnType[] = [
  {
    label: '角色名称',
    field: 'roleName',
    placeholder: '请输入',
    type: FormColumnTypeEnum.INPUT,
  },
  {
    label: '创建人',
    field: 'createByUsername',
    placeholder: '请输入',
    type: FormColumnTypeEnum.INPUT,
  },
  {
    label: '创建时间',
    field: 'time',
    type: FormColumnTypeEnum.DATE_RANGE,
    showTime: false,
    disabledDate: (current: Dayjs) => {
      return current && current > dayjs().endOf('day')
    },
    format: 'YYYY-MM-DD',
    placeholder: ['开始时间', '结束时间'],
  },
  {
    label: '是否启用',
    field: 'status',
    placeholder: '请选择',
    options: [
      { label: '是', value: 0 },
      { label: '否', value: 1 },
    ],
    type: FormColumnTypeEnum.SELECT,
  },
]
