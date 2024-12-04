<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import type { Key } from 'ant-design-vue/es/table/interface'
import type { ColumnsType } from 'ant-design-vue/lib/table'
import { computed, ref } from 'vue'

import { customDelay, customPaginationOptions, titleAndPaginationHeight } from '@/common/js/config'
import DynamicTooltip from '@/components/DynamicTooltip.vue'
import { ROLE_TYPE } from '@/interface/system/roleManage'
import type { RoleListInfo, TablePageChange } from '@/interface/system/roleManage'
import { formatTime } from '@/utils/format'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageNum: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  dataSource: {
    type: Array<RoleListInfo>,
    default: () => [],
  },
  selectList: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['pageChange', 'select', 'delete', 'toedit'])
const remarkCellWidth = ref(300)
const columns: ColumnsType<RoleListInfo> = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 50,
  },
  {
    title: '名称',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
    width: remarkCellWidth.value,
  },
  {
    title: '创建者',
    dataIndex: 'createByUsername',
    key: 'createByUsername',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
]
const roleTable = ref(null)
const { height } = useElementSize(roleTable)
const scrollHeight = computed(() => {
  return height.value - titleAndPaginationHeight.logsAndRole
})

function roleSelection(selectedRowKeys: string[]) {
  emits('select', selectedRowKeys)
}

function getCheckboxProps(record: RoleListInfo) {
  return {
    disabled: record.roleType === 1,
  }
}

function handleTableChange({ current, pageSize: size }: TablePageChange) {
  emits('pageChange', { current, size })
}
const pagination = computed(() => ({
  total: props.total,
  current: props.pageNum,
  pageSize: props.pageSize,
  ...customPaginationOptions,
}))

function handleDelete(id: string) {
  emits('delete', [id])
}

async function openInfoModal(id: string) {
  emits('toedit', id)
}

function dividerVisible(type: number) {
  const permissions = sessionStorage.getItem('permissions') || '[]'
  const list = JSON.parse(permissions)

  if (type === 1) {
    return list?.includes('button_contact_role_delete')
  }
  else {
    return ['button_contact_role_edit', 'button_contact_role_delete'].every(val =>
      list?.includes(val),
    )
  }
}
</script>

<template>
  <div ref="roleTable" class="h-[calc(100%-40px)]">
    <a-table
      size="small"
      class="bg-[#fff] my-[10px]"
      :columns="columns"
      :data-source="dataSource"
      bordered
      sticky
      center
      :scroll="{ y: scrollHeight }"
      :loading="{ spinning: loading, delay: customDelay }"
      row-key="id"
      :pagination="pagination"
      :row-selection="{
        onChange: (selectedRowKeys: Key[]) => roleSelection(selectedRowKeys as string[]),
        getCheckboxProps,
        selectedRowKeys: props.selectList as Key[],
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text, index, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-button
            v-if="record.roleType === ROLE_TYPE.system"
            class="px-0"
            type="link"
            @click="openInfoModal(record.id)"
          >
            查看
          </a-button>
          <a-button
            v-else
            v-permission="['button_contact_role_edit']"
            class="px-0"
            type="link"
            @click="openInfoModal(record.id)"
          >
            编辑
          </a-button>
          <a-divider v-if="dividerVisible(record.roleType)" type="vertical" />
          <a-button
            v-permission="['button_contact_role_delete']"
            class="px-0m ml-5px"
            type="link"
            danger
            :disabled="record.roleType === ROLE_TYPE.system"
            @click="handleDelete(record.id)"
          >
            删除
          </a-button>
        </template>
        <template v-else-if="column.dataIndex === 'index'">
          <span>{{ index + 1 + (pageNum - 1) * pageSize }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'remark'">
          <DynamicTooltip :width="remarkCellWidth" :message="record.remark" />
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          <span>
            {{ formatTime(Number(text), 'YYYY-MM-DD HH:mm') }}
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="less" scoped></style>
