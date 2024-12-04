import { type Ref, ref } from 'vue'

import { FormColumnTypeEnum } from '@/enums'
import type { FormColumnType, FormConfigType } from '@/interface/form'

export const formConfig: FormConfigType = {
  rules: {
    path: [{ required: true, message: '请输入请求地址', trigger: 'change' }],
    name: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
    code: [{ required: true, message: '请输入权限标识', trigger: 'change' }],
    permissionType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
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
    label: '上级菜单',
    field: 'parentId',
    type: FormColumnTypeEnum.TREE_SELECT,
    placeholder: '请选择',
    treeData: [],
    disabled: true,
    fieldNames: { children: 'children', label: 'name', value: 'id' },
  },
  {
    label: '菜单类型',
    field: 'permissionType',
    type: FormColumnTypeEnum.SELECT,
    placeholder: '请选择',
    options: [
      {
        label: '目录',
        value: 1,
      },
      {
        label: '菜单',
        value: 2,
      },
      {
        label: '按钮',
        value: 3,
      },
    ],
  },
  {
    label: '菜单名称',
    field: 'name',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入菜单名称',
  },
  {
    label: '请求地址',
    field: 'path',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入请求地址',
  },
  {
    label: '权限标识',
    field: 'code',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入权限标识',
  },
])
