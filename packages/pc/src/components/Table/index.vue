<script setup lang="ts">
import type { TableProps } from 'ant-design-vue/es/table/Table'
import type {
  FilterValue,
  Key,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
  TableRowSelection,
} from 'ant-design-vue/es/table/interface'
import type { DataIndex } from 'ant-design-vue/es/vc-table/interface'
import dayjs from 'dayjs'
import { type ComputedRef, computed, onBeforeUnmount, ref, watch } from 'vue'

import { TableColumnTypeEnum } from '@/enums'
import type { TableColumnAllType } from '@/interface/table'

import { tableDefaultConfig } from './tableDefaultConfig'

const props = withDefaults(
  defineProps<{
    data: any // 根据传值决定
    columns: TableColumnAllType[]
    config?: TableProps
    loading?: boolean
    selectList?: Key[]
  }>(),
  {
    config: undefined,
    data: () => [],
    columns: () => [],
    selectList: () => [],
  },
)
const emit = defineEmits(['update:selectList', 'change', 'selectChange', 'linkChange', 'rowClick'])
const slots = defineSlots()
const selectList = ref(props.selectList)
const data = computed(() => props.data)
const config = computed(() => Object.assign({}, tableDefaultConfig, props.config))
const loading = computed(() => props.loading)
const expandedRowKeys = ref<string[]>([])

function onSelectChange(selectedRowKeys: Key[], selectedRows: any) {
  if (config.value.rowSelection!.type === 'radio')
    selectList.value = selectedRowKeys
  emit('update:selectList', selectList.value)
  emit('selectChange', selectedRows)
}

watch(
  () => props.selectList,
  (val) => {
    selectList.value = val
  },
  {
    deep: true,
    immediate: true,
  },
)

const allChange = (selected: boolean, selectedRows: any, changeRows: any[]) => {
  if (!selected) {
    selectList.value = selectList.value!.filter(
      selectItem =>
        !changeRows.some(changeItem => changeItem[config.value.rowKey!] === selectItem),
    )
  }
  else {
    changeRows.forEach((arr: any) => {
      selectList.value!.push(arr[config.value.rowKey!])
    })
  }
  emit('update:selectList', selectList.value)
}

const rowChange = (record: any) => {
  const index = selectList.value!.indexOf(record[config.value.rowKey!])
  if (index !== -1)
    selectList.value!.splice(index, 1)
  else selectList.value!.push(record[config.value.rowKey!])
  emit('update:selectList', selectList.value)
}

const selection: ComputedRef<TableRowSelection<any> | undefined> = computed(() => {
  if (props?.config?.rowSelection !== null) {
    const tableRowSelection: TableRowSelection<any> = {
      ...tableDefaultConfig.rowSelection,
      ...props?.config?.rowSelection,
      selectedRowKeys: selectList.value,
      onChange: onSelectChange,
      onSelectAll: allChange,
      onSelect: rowChange,
    }
    return tableRowSelection
  }
  else {
    return undefined
  }
})

function changePaginationEvent(
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue>,
  sorter: SorterResult<any> | SorterResult<any>[],
  extra: TableCurrentDataSource<any>,
) {
  if (typeof config.value.pagination !== 'boolean') {
    if (config.value.pagination!.pageSize !== pagination.pageSize)
      pagination.current = 1
    config.value.pagination!.current = pagination.current
    config.value.pagination!.pageSize = pagination.pageSize
  }
  emit('change', pagination, filters, sorter, extra)
}

function handleLink(row: any, key?: DataIndex) {
  emit('linkChange', row, key)
}

onBeforeUnmount(() => {
  if (config.value.pagination) {
    config.value.pagination!.current = 1
    config.value.pagination!.pageSize = 10
  }
})

function rowClickEvent(row: any) {
  emit('rowClick', row)
}

function fatherExpand(expanded: boolean, props: any) {
  if (expanded)
    expandedRowKeys.value.push(props.id)
  else expandedRowKeys.value = expandedRowKeys.value.filter(item => item !== props.id)
}
</script>

<template>
  <div class="w-full">
    <div v-if="slots.header" class="mb-4">
      <slot name="header" />
    </div>
    <a-table
      v-bind="config"
      :data-source="data"
      :columns="props.columns"
      :loading="loading"
      :expanded-row-keys="expandedRowKeys"
      :row-selection="selection"
      :custom-row="
        (record: any) => ({
          onClick: () => {
            return rowClickEvent(record)
          },
        })
      "
      @change="changePaginationEvent"
      @expand="fatherExpand"
    >
      <template #expandIcon="Iconprops">
        <span
          v-if="Iconprops && Iconprops.record.children && Iconprops.record.children.length"
          class="float-left ml-4 cursor-pointer"
        >
          <DownOutlined
            v-if="Iconprops.expanded"
            @click="
              (e: MouseEvent) => {
                Iconprops.onExpand(Iconprops.record, e)
              }
            "
          />
          <RightOutlined
            v-else
            @click="
              (e: MouseEvent) => {
                Iconprops.onExpand(Iconprops.record, e)
              }
            "
          />
        </span>
        <span v-else class="float-left ml-4 w-22px h-14px" />
      </template>
      <template
        #bodyCell="{
          column,
          record,
          text,
          index,
        }: {
          column: TableColumnAllType
          record: Record<string, any>
          text: any
          index: number
        }"
      >
        <template v-if="column.type === TableColumnTypeEnum.OPERATION">
          <a-space>
            <slot :key="column.dataIndex" :row="record" />
          </a-space>
        </template>
        <template v-if="column.type === TableColumnTypeEnum.INDEX">
          <span v-if="config.pagination && typeof config.pagination !== 'boolean'">
            {{
              ((config.pagination?.current ?? 1) - 1) * (config.pagination?.pageSize ?? 10)
                + index
                + 1
            }}
          </span>
          <span v-else>{{ index + 1 }}</span>
        </template>
        <template v-if="column.type === TableColumnTypeEnum.TEXT">
          {{ text }}
        </template>
        <template v-if="column.type === TableColumnTypeEnum.NUMBER">
          {{ text ?? 0 }}
        </template>
        <template v-if="column.type === TableColumnTypeEnum.TOOLTIP">
          <DynamicTooltip :width="column.width" :message="text" />
        </template>
        <template v-if="column.type === TableColumnTypeEnum.LINK">
          <div
            type="link"
            class="cursor-pointer text-blue-600"
            @click="handleLink(record, column.dataIndex)"
          >
            {{ text }}
          </div>
        </template>
        <template v-if="column.type === TableColumnTypeEnum.TAG">
          <a-tag
            v-if="text !== null && text !== undefined"
            :color="column.typeMap && column.typeMap[text]"
          >
            {{ column.valueMap && column.valueMap[text] }}
          </a-tag>
          <span v-else>-</span>
        </template>
        <template v-if="column.type === TableColumnTypeEnum.SELECT">
          {{ column.valueMap && column.valueMap[text] }}
        </template>
        <template v-if="column.type === TableColumnTypeEnum.DATE">
          <template v-if="text">
            {{
              column.format ? dayjs(+text).format(column.format) : dayjs(+text).format('YYYY-MM-DD')
            }}
          </template>
          <span v-else>-</span>
        </template>
        <template v-if="column.type === TableColumnTypeEnum.ARRAY">
          {{ column.separator ? text?.join(column.separator) : text?.join(',') }}
        </template>
        <template v-if="column.type === TableColumnTypeEnum.SEX">
          <div>
            {{ +text ? '女' : '男' }}
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
