import { type Ref, ref } from 'vue'

import { FormColumnTypeEnum } from '@/enums'
import type { FormColumnType, FormConfigType } from '@/interface/form'

export const formConfig: FormConfigType = {
  rules: {
    dictName: [{ required: true, message: '请输入字典名称', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  },
  col: {
    span: 24,
  },
  labelCol: {
    style: {
      width: '120px',
    },
  },
}

export const dictionaryValueFormConfig: FormConfigType = {
  rules: {
    dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'change' }],
    dictValue: [{ required: true, message: '请输入字典键值', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  },
  col: {
    span: 24,
  },
  labelCol: {
    style: {
      width: '120px',
    },
  },
}

export const formColumns: Ref<FormColumnType[]> = ref([
  {
    label: '字典名称',
    field: 'dictName',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入字典名称',
  },
  {
    label: '字典类型',
    field: 'dictType',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入字典类型',
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
  {
    label: '备注',
    field: 'remark',
    type: FormColumnTypeEnum.TEXTAREA,
    placeholder: '请输入',
  },
])

export const dictionaryValueFormColumns: Ref<FormColumnType[]> = ref([
  {
    label: '字典标签',
    field: 'dictLabel',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入字典名称',
  },
  {
    label: '字典键值',
    field: 'dictValue',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入字典类型',
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
  {
    label: '备注',
    field: 'remark',
    type: FormColumnTypeEnum.TEXTAREA,
    placeholder: '请输入',
  },
])
