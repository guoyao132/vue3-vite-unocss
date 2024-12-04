import type { PickerMode } from 'ant-design-vue/es/vc-picker/interface'

import type { FormConfigType } from '@/interface/form'

export const formDefaultConfig: FormConfigType = {
  layout: 'horizontal',
  labelCol: {
    style: {
      width: '200px',
    },
  },
  row: {
    gutter: [16, 0],
    justify: 'start',
    align: 'middle',
    wrap: true,
  },
  col: {
    sm: {
      span: 24,
    },
    md: {
      span: 24,
    },
    lg: {
      span: 12,
    },
    xl: {
      span: 12,
    },
  },
  isEmbedded: false,
  hasValidator: true,
}

export const selectDefaultConfig = {
  allowClear: true,
  showSearch: true,
}

export const dateRangeDefaultConfig = {
  showTime: { format: 'HH:mm' },
  format: 'YYYY-MM-DD HH:mm',
  valueFormat: 'x',
  placeholder: ['开始时间', '结束时间'],
}

export const datePickerDefaultConfig = {
  picker: 'year' as PickerMode,
  placeholder: '请选择',
  valueFormat: 'x',
}
