<script setup lang="ts">
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { PaginationConfig } from 'ant-design-vue/es/pagination'
import useSWRV from 'swrv'
import { ref, watch } from 'vue'

import { deleteDictionary, getDictionaryList } from '@/api/system/dictionary'
import type { IDictionaryAddOrEditParams } from '@/interface/system/dictionary'
import router from '@/router'

import AddOrEditModal from './addOrEditModal.vue'
import { headerColumns, headerConfig } from './config/formConfig'
import { tableColumns, tableConfig } from './config/tableConfig'

const formState = ref({})
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const selectList = ref<string[]>([])
const modalRef = ref<InstanceType<typeof AddOrEditModal>>()

const {
  data: dataSource,
  isValidating: loading,
  mutate: getList,
} = useSWRV(
  () => `[dictionary-list]${JSON.stringify(queryParams.value)}`,
  () => getDictionaryList(queryParams.value),
  NotRevalidateOption,
)

watch(
  () => dataSource.value,
  () => {
    tableConfig.value.pagination!.total = dataSource.value?.total as number
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

const toDetail = (id: string) => {
  router.push({ path: '/system-settings/dictionary-data', query: { id } })
}

const toEdit = (row: IDictionaryAddOrEditParams) => {
  modalRef.value?.showModal(true, false, row)
}

const toAdd = () => {
  modalRef.value?.showModal(false, false)
}

const deleteInList = async (id: string) => {
  const [, err] = await to(deleteDictionary(id))

  if (!err) {
    message.success('删除成功！')
    if (queryParams.value.pageNum > 1 && dataSource.value!.list.length === 1)
      queryParams.value.pageNum--
    tableConfig.value.pagination!.current = queryParams.value.pageNum
    getList()
  }
  else {
    message.error(err.message)
  }
}

const tapSearchRole = () => {
  queryParams.value.pageNum = 1
  tableConfig.value.pagination!.current = 1
  Object.assign(queryParams.value, formState.value)
}

const resetForm = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
  }
  formState.value = {}
  tableConfig.value.pagination!.current = queryParams.value.pageNum
  tableConfig.value.pagination!.pageSize = queryParams.value.pageSize
}
</script>

<template>
  <Page>
    <div class="h-full flex flex-col">
      <Card class="mb-10px">
        <Search @search="tapSearchRole" @reset="resetForm">
          <Form
            v-model:data="formState"
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
          :data="dataSource ? dataSource.list : []"
          :columns="tableColumns"
          :loading="loading"
          @change="changePaginationEvent"
        >
          <template #header>
            <div class="flex justify-between py-2">
              <a-button type="primary" @click="toAdd">
                新增
              </a-button>
            </div>
          </template>
          <template #default="{ row }">
            <a-button class="px-0" type="link" @click="toEdit(row)">
              编辑
            </a-button>
            <a-button class="px-0" type="link" @click="toDetail(row.id)">
              数据列表
            </a-button>
            <a-button class="px-0" type="link" danger @click="deleteInList(row.id)">
              删除
            </a-button>
          </template>
        </Table>
      </Card>
    </div>
    <AddOrEditModal ref="modalRef" @refresh="getList" />
  </Page>
</template>
