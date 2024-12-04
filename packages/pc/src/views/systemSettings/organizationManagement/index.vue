<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

import type { ITableList, ITreeAdd, ITreeEdit, ITreeSelect } from '@/interface/system/organization'
import { useOrgTableStore } from '@/stores/innerOrganization'

import Table from './components/table.vue'
import TableModal from './components/tableModal.vue'
import Tree from './components/tree.vue'
import TreeModal from './components/treeModal.vue'

const treeRef = ref<InstanceType<typeof Tree>>()
const tableRef = ref<InstanceType<typeof Table>>()
const treeModalRef = ref<InstanceType<typeof TreeModal>>()
const tableModalRef = ref<InstanceType<typeof TableModal>>()

// 打开新增弹窗-树形
function handleAddOrganizationEmit(addParams: ITreeAdd) {
  treeModalRef.value?.showModal(addParams)
}

// 打开编辑弹窗-树形
function handleEditOrganizationEmit(editParams: ITreeEdit) {
  treeModalRef.value?.showModal(editParams)
}

// 树形选择，获取表格
function handleOnSelectOrg(orgParams: ITreeSelect) {
  tableRef.value?.selectOrgGetTableList(orgParams)
}

// 刷新表格
function handleRefreshTable() {
  tableRef.value?.refresh()
}

// 打开弹窗-列表
function handleAddOrEditListEmit(isEdit = false, record?: ITableList) {
  tableModalRef.value?.showModal(isEdit, record)
}
onUnmounted(() => {
  const orgTableStore = useOrgTableStore()
  orgTableStore.clearOrgTableList()
})

function isBusinessRole() {
  const permissions = sessionStorage.getItem('permissions')
  return permissions?.includes('button_contact_department_get_user')
}
</script>

<template>
  <Page>
    <div class="bg-[#fff] flex h-full py-3 px-3 radius-5">
      <!-- 左侧：机构 -->
      <div class="border-r-1 left min-w-4/12 max-w-4/12 pr-2">
        <Tree
          ref="treeRef"
          :show-search="isBusinessRole()"
          @add-organization-emit="handleAddOrganizationEmit"
          @edit-organization-emit="handleEditOrganizationEmit"
          @on-select-org="handleOnSelectOrg"
        />
      </div>
      <!-- 分割线 -->
      <!-- 右侧；表格 -->
      <div class="h-full max-w-8/12 pl-2 overflow-hidden">
        <Table ref="tableRef" @add-or-edit-list-emit="handleAddOrEditListEmit" />
      </div>
      <TreeModal ref="treeModalRef" />
      <TableModal ref="tableModalRef" @refresh-table="handleRefreshTable" />
    </div>
  </Page>
</template>

<style scoped></style>
