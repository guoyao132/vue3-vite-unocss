<script setup lang="ts">
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { PaginationConfig } from 'ant-design-vue/es/pagination'
import dayjs from 'dayjs'
import useSWRV from 'swrv'
import { ref, watch } from 'vue'

import { deleteRole, getRoleList } from '@/api/system/roleManage'
import type { ISearchFormState } from '@/interface/system/roleManage'

import AddOrEditModal from './component/addRole.vue'
import { headerColumns, headerConfig } from './config/formConfig'
import { tableColumns, tableConfig } from './config/tableConfig'

const addModalRef = ref<InstanceType<typeof AddOrEditModal>>()
const searchParam = ref<ISearchFormState>({} as ISearchFormState)
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const selectList = ref<string[]>([])

const {
  data: tableData,
  isValidating: tableLoading,
  mutate: getList,
} = useSWRV(
  () => `[role-list]${JSON.stringify(queryParams.value)}`,
  () => getRoleList(queryParams.value),
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

function searchQueryEvent() {
  if (searchParam.value.time && searchParam.value.time.length) {
    searchParam.value.startTime = dayjs(+searchParam.value.time[0]).startOf('day').valueOf()
    searchParam.value.endTime = dayjs(+searchParam.value.time[1]).endOf('day').valueOf()
  }
  else {
    searchParam.value.startTime = null
    searchParam.value.endTime = null
  }
  queryParams.value.pageNum = 1
  tableConfig.value.pagination!.current = 1
  Object.assign(queryParams.value, searchParam.value)
}

function resetQueryEvent() {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
  }
  tableConfig.value.pagination!.current = 1
  tableConfig.value.pagination!.pageSize = 10
  searchParam.value = {} as ISearchFormState
}

function changePaginationEvent(pagination: PaginationConfig) {
  if (pagination) {
    queryParams.value.pageNum = pagination.current!
    queryParams.value.pageSize = pagination.pageSize!
  }
}

async function clickDeleteEvent(id: string) {
  const [, err] = await to(deleteRole({ ids: [id] }))

  if (!err) {
    message.success('删除成功')
    if (queryParams.value.pageNum > 1 && tableData.value!.list.length === 1)
      queryParams.value.pageNum--
    tableConfig.value.pagination!.current = queryParams.value.pageNum
    getList()
  }
  else {
    message.error(err.message)
  }
}

async function clickBatchDeleteEvent() {
  if (selectList.value.length) {
    const [, err] = await to(deleteRole({ ids: selectList.value }))

    if (!err) {
      message.success('删除成功')
      if (queryParams.value.pageNum > 1 && tableData.value!.list.length === 1)
        queryParams.value.pageNum--
      tableConfig.value.pagination!.current = queryParams.value.pageNum
      selectList.value = []
      getList()
    }
    else {
      message.error(err.message)
    }
  }
  else {
    message.warning('请先选择需要删除的数据')
  }
}

async function addOrEditEvent(isEdit: boolean, id?: string) {
  addModalRef.value?.showModal(isEdit, id)
}
</script>

<template>
  <Page>
    <div class="h-full flex flex-col">
      <Card class="mb-10px">
        <Search :expand="false" @search="searchQueryEvent" @reset="resetQueryEvent">
          <Form
            v-model:data="searchParam"
            :columns="headerColumns"
            :config="headerConfig"
            class="flex-1"
          />
        </Search>
      </Card>
      <Card>
        <Table
          v-model:select-list="selectList"
          :config="tableConfig"
          :data="tableData ? tableData.list : []"
          :loading="tableLoading"
          :columns="tableColumns"
          @change="changePaginationEvent"
        >
          <template #header>
            <div class="flex items-center flex-row-reverse">
              <a-space :size="20">
                <a-button @click="addOrEditEvent(false)">
                  新增
                </a-button>
                <a-button @click="clickBatchDeleteEvent">
                  批量删除
                </a-button>
              </a-space>
            </div>
          </template>
          <template #default="{ row }">
            <a-button type="link" class="px-0" @click="addOrEditEvent(true, row.id)">
              编辑
            </a-button>
            <a-button danger type="link" class="px-0" @click="clickDeleteEvent(row.id)">
              删除
            </a-button>
          </template>
        </Table>
      </Card>
      <AddOrEditModal ref="addModalRef" @add-refresh="getList" />
    </div>
  </Page>
</template>
