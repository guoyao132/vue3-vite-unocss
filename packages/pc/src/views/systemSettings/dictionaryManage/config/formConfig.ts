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
    label: '字典名称',
    field: 'dictName',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入',
  },
  {
    label: '字典类型',
    field: 'dictType',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入',
  },
  {
    label: '状态',
    field: 'status',
    type: FormColumnTypeEnum.SELECT,
    placeholder: '请选择',
    options: [
      {
        label: '正常',
        value: 0,
      },
      {
        label: '停用',
        value: 1,
      },
    ],
  },
]
