<script setup lang="ts">
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import useSWRV from 'swrv'
import { ref } from 'vue'

import { deleteMenu, getMenuList } from '@/api/system/menuManage'
import type { IMenuTreeRecord } from '@/interface/system/menuManage'

import AddOrEditModal from './addOrEditModal.vue'
import { formColumns } from './config/editFormConfig'
import { tableColumns, tableConfig } from './config/tableConfig'

const modalRef = ref<InstanceType<typeof AddOrEditModal>>()

const initData = async () => {
  const [data, error] = await to(getMenuList())

  if (error) {
    message.error(error.message)
    return
  }

  function formatMenu(list: IMenuTreeRecord[]) {
    list.forEach((item) => {
      item.children = item.items
      const { sortNumber, permissionType, code, path } = item.self
      Object.assign(item, { sortNumber, permissionType, code, path })

      if (item.hasChildren)
        formatMenu(item.items)
    })
  }
  formatMenu(data)
  const parentIndex = formColumns.value.findIndex(item => item.field === 'parentId')
  formColumns.value[parentIndex].treeData = [...data, { name: '主目录', id: null, parentId: null }]
  return data
}

const {
  data: dataSource,
  isValidating: loading,
  mutate: getList,
} = useSWRV(() => '[menu-list]', initData, NotRevalidateOption)

function toEdit(row: IMenuTreeRecord) {
  modalRef.value?.showModal(true, row)
}

function toAdd(row?: IMenuTreeRecord) {
  modalRef.value?.showModal(false, row)
}

async function toDelete(id: string) {
  const [, err] = await to(deleteMenu(id))

  if (!err) {
    message.success('删除成功！')
    getList()
  }
  else {
    message.error(err.message)
  }
}
</script>

<template>
  <Page>
    <div class="h-full flex flex-col">
      <Card>
        <Table
          :config="tableConfig"
          :data="dataSource ? dataSource : []"
          :columns="tableColumns"
          :loading="loading"
        >
          <template #header>
            <div class="flex justify-between py-2">
              <a-button type="primary" @click="toAdd()">
                新增主目录
              </a-button>
            </div>
          </template>
          <template #default="{ row }">
            <a-button class="px-0" type="link" @click="toAdd(row)">
              新增
            </a-button>
            <a-button class="px-0" type="link" @click="toEdit(row)">
              编辑
            </a-button>
            <a-button class="px-0" type="link" danger @click="toDelete(row.id)">
              删除
            </a-button>
          </template>
        </Table>
      </Card>
    </div>
    <AddOrEditModal ref="modalRef" @refresh="getList" />
  </Page>
</template>
