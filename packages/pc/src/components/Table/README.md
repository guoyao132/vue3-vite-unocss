# 公共Table组件 使用文档

该公共Table组件是基于antd-vue中的a-table组件进行封装，用于全局统一表格风格，快速生成表格，表格UI可根据各自项目自定义。使用时将表格配置分离提取为单独TS文件，表格内容形式目前仅集成了文本、数字、tooltip、tag、时间、性别、数组等，后续根据各自项目可增加相关类型或更改原有类型。

### 在 Vue 3 组件中的示例

```ts
import { type Ref, ref } from 'vue'

import { TableColumnTypeEnum } from '@/const/enum'
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

export const tableColumns: TableColumnAllType[] = [
  {
    title: '序号',
    key: 'index',
    fixed: 'left',
    align: 'center',
    width: 50,
    type: TableColumnTypeEnum.INDEX,
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    align: 'center',
    fixed: 'left',
    width: 120,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '项目编号',
    dataIndex: 'projectCode',
    align: 'center',
    width: 100,
    type: TableColumnTypeEnum.TEXT,
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    align: 'center',
    width: 300,
    type: TableColumnTypeEnum.OPERATION,
  },
]
```

```vue
<script setup lang="ts">
import type { PaginationConfig } from 'ant-design-vue/es/pagination'

import { tableColumns, tableConfig } from './config/tableConfig'

const queryParams = ref<AnnualPlanQueryType>({
  pageNum: 1,
  pageSize: 10,
})
const selectList = ref<string[]>([])

const {
  data: tableData,
  isValidating: tableLoading,
  mutate: getList,
} = useSWRV(
  () => `[getData-key]${JSON.stringify(queryParams.value)}`,
  () => getDataList(queryParams.value),
  NotRevalidateOption,
)

watch(
  () => tableData.value,
  () => {
    tableConfig.value.pagination!.total = tableData.value?.total
  },
  {
    deep: true,
    immediate: true,
  },
)

function changePaginationEvent(pagination: PaginationConfig) {
  if (pagination) {
    queryParams.value.pageNum = pagination.current!
    queryParams.value.pageSize = pagination.pageSize!
  }
}
</script>

<template>
  <Table
    v-model:select-list="selectList"
    :config="tableConfig"
    :data="tableData ? tableData.list : []"
    :loading="tableLoading"
    :columns="tableColumns"
    @change="changePaginationEvent"
  >
    <template #header>
      <a-button>
        新增
      </a-button>
      <a-button>
        导入
      </a-button>
      <a-button>
        批量删除
      </a-button>
    </template>
    <template #default="{ row }">
      <a-button>
        编辑
      </a-button>
      <a-button>
        删除
      </a-button>
    </template>
  </Table>
</template>
```

### 配置参数

  data: 数据源。

  columns: 表格column

  config: 表格配置项。

  loading: 表格loading。

  selectList: 表格选择的key数组。
