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
    label: '执行时间',
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
    label: '用户姓名',
    field: 'operationName',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入',
  },
  {
    label: '操作账号',
    field: 'account',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入',
  },
  {
    label: '操作内容',
    field: 'content',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入',
  },
  {
    label: '执行结果',
    field: 'result',
    type: FormColumnTypeEnum.SELECT,
    placeholder: '请选择',
    options: [
      {
        label: '成功',
        value: 0,
      },
      {
        label: '失败',
        value: 1,
      },
    ],
  },
  {
    label: '事件类型',
    field: 'eventType',
    type: FormColumnTypeEnum.SELECT,
    placeholder: '请选择',
    options: [
      {
        label: '系统级',
        value: 'SYSTEM_LEVEL',
      },
      {
        label: '业务级',
        value: 'SERVICE_LEVEL',
      },
      {
        label: '外部接口级',
        value: 'EXTERNAL_LEVEL',
      },
    ],
  },
  {
    label: '事件分类',
    field: 'eventCategory',
    type: FormColumnTypeEnum.SELECT,
    placeholder: '请选择',
    options: [
      {
        label: '正常事件',
        value: 'NORMAL_EVENT',
      },
      {
        label: '异常事件',
        value: 'ANOMALOUS_EVENT',
      },
    ],
  },
]
