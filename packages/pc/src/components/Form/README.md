# 公共Form组件 使用文档

该公共Form组件是基于antd-vue中的a-form组件进行封装，用于快速生成表单数据，可用于常规的信息编辑修改页、表格筛选部分，表单UI可根据各自项目自定义。使用时将表单配置分离提取为单独TS文件，表单内容形式目前仅集成了input,select,textarea,switch,range-picker,cascader等，后续根据各自项目可增加相关类型。

### 在 Vue 3 组件中的示例

```ts
import { type Ref, ref } from 'vue'

import { FormColumnTypeEnum } from '@/const/enum'
import type { FormColumnType, FormConfigType } from '@/interface/form'

export const formConfig: FormConfigType = {
  rules: {
    projectName: [
      { required: true, message: '请输入项目名称', trigger: 'change' },
    ],
    trainMethod: [
      { required: true, message: '请选择方式', trigger: 'change' },
    ],
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
  labelCol: {
    style: {
      width: '120px',
    },
  },
}

export const formColumns: Ref<FormColumnType[]> = ref([
  {
    label: '项目名称',
    field: 'projectName',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '请输入',
  },
  {
    label: '项目编号',
    field: 'projectCode',
    type: FormColumnTypeEnum.INPUT,
    placeholder: '自动生成，无需填写',
    disabled: true,
  },
  {
    label: '方式',
    field: 'trainMethod',
    type: FormColumnTypeEnum.SELECT,
    placeholder: '请选择',
    options: [],
    hidden: true,
  },
])
```

```vue
<script setup lang="ts">
import { formColumns, formConfig } from './config/detailFormConfig'

const selectList = ref<string[]>([])
const baseFormRef = ref<InstanceType<typeof Form> | null>()
const data = ref({})
</script>

<template>
  <Form
    ref="baseFormRef"
    v-model:data="data"
    :columns="formColumns"
    :config="formConfig"
  />
</template>
```

### 配置参数

  data: 数据源。

  columns: 表单column

  config: 表单配置项。
