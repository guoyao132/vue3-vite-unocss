<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import type { TreeProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { DataNode } from 'ant-design-vue/es/tree'
import debounce from 'lodash/debounce'
import useSWRV from 'swrv'
import { ref } from 'vue'

import {
  postOrganizationTreeListInDepartment,
  postSearchOrgTreeList,
  updateOrgType,
} from '@/api/system/organization'
import DeleteModal from '@/components/deleteModal.vue'
import { ORGANIZATION_LEVEL_TYPE } from '@/enums/index'
import type { IAsyncOrgData, ISearchDetail, ISearchList } from '@/interface/system/organization'
import { useOrgTableStore } from '@/stores/innerOrganization'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['addOrganizationEmit', 'editOrganizationEmit', 'onSelectOrg'])
enum ORG_LEVEL_TYPE {
  公司,
  单位,
  部门,
}
// =======================    数据定义    =======================
const keyword = ref<string>('')
const selectedKeys = ref<string[]>()
const expandedKeys = ref<string[]>()
const [deleteVisible, toggle] = useToggle()
const customMessage = ref('您确定需要更改组织类型么？')
const customHint = ref('更改后单位和部门关联的角色数据和业务数据可能会存在偏差或调整，请谨慎操作')
const deleteLoading = ref(false)

const fieldNames: TreeProps['fieldNames'] = {
  children: 'children',
  title: 'name',
  key: 'id',
}
// =======================    请求   =======================
const orgId = ref<number | null>() // 组织查询接口需要的orgId

async function getOrganizationTreeList() {
  const params = {
    orgType: 0,
    orgId: orgId.value ?? null,
  }
  const [data, err] = await to(postOrganizationTreeListInDepartment(params))
  if (!err)
    return data
  else message.error(err.message)
}
const { data: treeData } = useSWRV(
  '[innerOrganizationTree]',
  getOrganizationTreeList,
  NotRevalidateOption,
)

// 异步获取子级组织
async function getSonOrgList() {
  const params = {
    orgType: 0,
    orgId: orgId.value ?? null,
  }
  const [data, err] = await to(postOrganizationTreeListInDepartment(params))
  if (!err)
    return data
  else message.error(err.message)
}

const onLoadData: TreeProps['loadData'] = (treeNode) => {
  orgId.value = treeNode.id
  return new Promise((resolve) => {
    if (treeNode.dataRef?.children) {
      resolve(undefined)
      return
    }
    const sonOrg = getSonOrgList()
    sonOrg.then((res) => {
      treeNode.dataRef!.children = res as DataNode[] | undefined
      if (typeof treeData.value !== 'undefined')
        treeData.value = [...treeData.value]

      resolve(undefined)
    })
  })
}

const orgTableStore = useOrgTableStore()

const onSelect: TreeProps['onSelect'] = (selected, info) => {
  const { node } = info
  const params = {
    orgId: node.key, // 列表接口需要的orgId
  }
  selectedKeys.value = [String(node.key)]
  orgTableStore.setOrgIdAction(String(node.key))
  emits('onSelectOrg', params)
}

// 搜索展示详情
async function handleSearchMemberDetail(detail: ISearchDetail) {
  selectedKeys.value = [detail.orgId]
  const params = {
    orgId: detail.orgId,
    pageNum: 1,
    pageSize: 10,
  }
  emits('onSelectOrg', { ...params, memberName: detail.memberName })
  expandedKeys.value = detail.orgTreePathMappingList
}

const searchList = ref<ISearchList[]>([])

async function handleSearchClick() {
  if (!keyword.value) {
    searchList.value = []
    return
  }
  const params = {
    keyword: keyword.value,
    pageNum: 1,
    pageSize: 999,
  }
  const [data, err] = await to(postSearchOrgTreeList(params))
  if (!err)
    searchList.value = data.list
  else message.error(err.message)
}
const debounceHandleSearchClick = debounce(handleSearchClick, 1000)

const updateOrgId = ref('')
const updateOrgLevel = ref(0)

async function changeDepartType(e: Event, orgId: string) {
  const target = e.target as HTMLInputElement
  updateOrgId.value = orgId
  updateOrgLevel.value = target.value as unknown as number
  toggle()
}

function updateType(arr: IAsyncOrgData[] | undefined, id: string, type: number) {
  if (!arr)
    return
  const dataIndex = arr.findIndex(item => item.id === id)

  if (dataIndex === -1) {
    arr.forEach((item) => {
      if (item.children)
        updateType(item.children, id, type)
    })
  }
  else {
    arr[dataIndex].orgLevelType = type
  }
}

async function confirmInDelModal() {
  deleteLoading.value = true
  const params = {
    orgId: updateOrgId.value,
    orgLevelType: updateOrgLevel.value,
  }
  const [, err] = await to(updateOrgType(params))

  if (!err) {
    try {
      updateType(treeData.value, updateOrgId.value, updateOrgLevel.value)
      message.success('修改成功')
      cancelInDelModal()
    }
    catch {
      message.error('修改失败，请重试')
      deleteLoading.value = false
    }
  }
  else {
    deleteLoading.value = false
    message.error(err.message)
  }
}

function cancelInDelModal() {
  toggle()
  updateOrgId.value = ''
  updateOrgLevel.value = 0
  deleteLoading.value = false
}
</script>

<template>
  <div class="h-full w-full tree">
    <!-- 标题 -->
    <div class="flex mb-3 title justify-between">
      <h3 class="font-600">
        组织机构
      </h3>
    </div>
    <div v-if="props.showSearch" class="my-3">
      <a-input-search
        v-model:value="keyword"
        placeholder="请输入组织/姓名关键词"
        allow-clear
        @change="debounceHandleSearchClick"
      />
    </div>
    <!-- 搜索树形  -->
    <div v-if="!keyword" class="flex my-3 pr-[24%] pl-2 justify-between">
      <div class="font-600">
        组织名称
      </div>
      <div class="font-600">
        组织类型
      </div>
    </div>
    <div v-if="!keyword" class="w-full max-h-[calc(90vh-130px)] overflow-hidden overflow-y-auto">
      <a-tree
        v-model:selectedKeys="selectedKeys"
        v-model:expandedKeys="expandedKeys"
        :tree-data="treeData"
        :load-data="onLoadData"
        show-icon
        :field-names="fieldNames"
        @select="onSelect"
      >
        <template #title="{ name, orgLevelType, id, isManaged, canChangeLevelType }">
          <div class="flex w-full truncate justify-between">
            <template v-if="name.length < 15">
              <div class="w-1/2 truncate">
                <span>{{ name }}</span>
              </div>
              <div class="mr-4">
                {{ ORG_LEVEL_TYPE[orgLevelType] }}
              </div>
              <div class="flex mr-4 w-6 items-center">
                <a-popover
                  v-if="
                    orgLevelType !== ORGANIZATION_LEVEL_TYPE.company
                      && isManaged
                      && canChangeLevelType
                  "
                  trigger="hover"
                >
                  <template #content>
                    <a-radio-group
                      :value="orgLevelType"
                      @change="changeDepartType($event as unknown as Event, id)"
                    >
                      <a-radio class="flex" :value="1">
                        单位
                      </a-radio>
                      <a-radio class="flex" :value="2">
                        部门
                      </a-radio>
                    </a-radio-group>
                  </template>
                  <ellipsis-outlined
                    v-permission="['button_contact_department_change_level_type']"
                  />
                </a-popover>
              </div>
            </template>
            <template v-else>
              <a-tooltip placement="top">
                <template #title>
                  <span>{{ name }}</span>
                </template>
                <div class="w-1/2 truncate">
                  <span>
                    {{ name }}
                  </span>
                </div>
              </a-tooltip>
              <div class="mr-4">
                {{ ORG_LEVEL_TYPE[orgLevelType] }}
              </div>
              <div class="flex mr-4 w-6 items-center">
                <a-popover
                  v-if="
                    orgLevelType !== ORGANIZATION_LEVEL_TYPE.company
                      && isManaged
                      && canChangeLevelType
                  "
                  trigger="hover"
                >
                  <template #content>
                    <a-radio-group
                      :value="orgLevelType"
                      @change="changeDepartType($event as unknown as Event, id)"
                    >
                      <a-radio class="flex" :value="1">
                        单位
                      </a-radio>
                      <a-radio class="flex" :value="2">
                        部门
                      </a-radio>
                    </a-radio-group>
                  </template>
                  <ellipsis-outlined
                    v-permission="['button_contact_department_change_level_type']"
                  />
                </a-popover>
              </div>
            </template>
          </div>
        </template>
      </a-tree>
    </div>
    <div v-else class="w-full max-h-[calc(100%)] overflow-hidden overflow-y-auto">
      <template v-for="(item, index) in searchList" :Key="index">
        <div
          class="cursor-pointer flex w-full items-center hover:(bg-[#bae7ff])"
          @click="handleSearchMemberDetail(item)"
        >
          <div class="mr-2 text-xl py-2">
            <user-outlined class="text-gray-400" />
          </div>
          <div class="text-xs text-slate-400 w-9/10 truncate">
            <div v-if="item.memberName">
              {{ item.memberName }}
            </div>
            <a-tooltip placement="top">
              <template #title>
                <span>{{ item.orgTreeNamePathMapping }}</span>
              </template>
              <span>
                {{ item.orgTreeNamePathMapping }}
              </span>
            </a-tooltip>
          </div>
        </div>
      </template>
    </div>
  </div>
  <DeleteModal
    :visible="deleteVisible"
    title="更改组织"
    :message="customMessage"
    :hint="customHint"
    :loading="deleteLoading"
    @confirm="confirmInDelModal"
    @cancel="cancelInDelModal"
  />
</template>

<style lang="less" scoped>
.tree {
  :deep(.ant-tree-list .ant-tree-treenode) {
    width: 100%;
  }

  :deep(.ant-tree-node-content-wrapper) {
    flex: 1;
    overflow: auto;
  }
}
:deep(.ant-input-search-button) {
  height: 40px;
  width: 40px;
}
</style>
