<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { PaginationConfig } from 'ant-design-vue/es/pagination'
import useSWRV from 'swrv'
import { ref, watch } from 'vue'

import { deleteDictionaryDetail, getDictionaryDetailList } from '@/api/system/dictionary'
import type { IDictionaryAddOrEditParams } from '@/interface/system/dictionary'

import AddOrEditModal from './addOrEditModal.vue'
import { headerColumns, headerConfig } from './config/detailFormConfig'
import { tableColumns, tableConfig } from './config/detailTableConfig'

const formState = ref({})
const params: Record<string, string | null> = useUrlSearchParams('hash')
const dictId = params.id as string
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  dictId,
})
const selectList = ref<string[]>([])
const modalRef = ref<InstanceType<typeof AddOrEditModal>>()

const {
  data: dataSource,
  isValidating: loading,
  mutate: getList,
} = useSWRV(
  () => `[dictionary-detail-list]${JSON.stringify(queryParams.value)}`,
  () => getDictionaryDetailList(queryParams.value),
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

const toEdit = (row: IDictionaryAddOrEditParams) => {
  const updatedRow = { ...row, dictId }
  modalRef.value?.showModal(true, true, updatedRow)
}

const toAdd = () => {
  modalRef.value?.showModal(false, true, { dictId })
}

const deleteInList = async (id: string) => {
  const [, err] = await to(deleteDictionaryDetail(id))

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
    dictId,
  }
  formState.value = {}
  tableConfig.value.pagination!.current = queryParams.value.pageNum
  tableConfig.value.pagination!.pageSize = queryParams.value.pageSize
}
</script>

<template>
  <Page>
    <div class="h-full flex flex-col">
      <Back />
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
