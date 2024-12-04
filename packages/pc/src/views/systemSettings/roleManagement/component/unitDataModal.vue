<script setup lang="ts">
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import { Empty, message } from 'ant-design-vue'
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface'
import debounce from 'lodash/debounce'
import useSWRV from 'swrv'
import { ref, watch } from 'vue'

import { getUnitList } from '@/api/system/roleManage'
import type { BasicDepartmentInfo, CheckUnit, UnitRecord } from '@/interface/system/roleManage'

const props = defineProps({
  unitList: {
    type: Array,
    default: () => [],
  },
  canbeEdit: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['handleSelect'])

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const keyword = ref<string>('')
const listData = ref<CheckUnit[]>([])
const list = ref<BasicDepartmentInfo[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

watch(
  () => props.unitList,
  (val) => {
    list.value = val as BasicDepartmentInfo[]
    const idMap: CheckUnit[] = []
    list.value.forEach((item) => {
      idMap.push({
        label: item.orgTreeNamePathMapping,
        value: item.deptId,
        checked: true,
      })
    })
    listData.value = idMap
  },
  {
    immediate: true,
  },
)

async function getOrganizationTreeList() {
  const params = {
    orgLevelType: 1,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
  }
  const [data, err] = await to(getUnitList(params))

  if (!err) {
    data.list.forEach((item: UnitRecord) => {
      const idArray = list.value.map(item => item.deptId)
      const exist = listData.value.some(jtem => jtem.value === item.orgId)

      if (idArray.includes(item.orgId)) {
        item.checked = true

        if (!exist) {
          listData.value.push({
            label: item.orgTreeNamePathMapping,
            value: item.orgId,
            checked: true,
          })
        }
      }
      else {
        item.checked = false
      }
    })
    total.value = data.total
    return data.list
  }
  else {
    message.error(err.message)
  }
}
const { data: organizationData, mutate } = useSWRV(
  () => `[organizationTree]${pageNum.value}-${pageSize.value}`,
  () => getOrganizationTreeList(),
  NotRevalidateOption,
)

function handleCheckChange(e: CheckboxChangeEvent) {
  if (!e.target)
    return
  const target = e.target as HTMLInputElement

  if (target.checked) {
    list.value.push({
      deptId: target.value,
      name: target.name,
      orgTreeNamePathMapping: target.name,
    })
    emits('handleSelect', list.value)
    listData.value.push({
      label: target.name,
      value: target.value,
      checked: target.checked,
    })
  }
  else {
    const index = list.value.findIndex(item => item.deptId === target.value)
    list.value.splice(index, 1)
    emits('handleSelect', list.value)
    const dataIndex = listData.value.findIndex(item => item.value === target.value)
    listData.value.splice(dataIndex, 1)
  }
}

function handleRemove(data: CheckUnit) {
  const index = list.value.findIndex(item => item.deptId === data.value)
  list.value.splice(index, 1)
  emits('handleSelect', list.value)
  listData.value.splice(index, 1)
  const orgDataIndex = organizationData.value!.findIndex(
    (item: UnitRecord) => item.orgId === data.value,
  )
  organizationData.value![orgDataIndex].checked = false
}

function handleRemoveAll() {
  list.value = []
  emits('handleSelect', list.value)
  listData.value = []
  organizationData.value!.forEach((item: UnitRecord) => (item.checked = false))
}

async function handleSearchClick() {
  pageNum.value = 1
  mutate()
}
const debounceHandleSearchClick = debounce(handleSearchClick, 500)
</script>

<template>
  <a-card :bordered="false" class="h-full overflow-y-auto">
    <div
      v-if="listData.length"
      class="w-auto min-h-[160px] border border-gray-500/20 pt-[10px] relative pb-[30px]"
    >
      <div class="flex flex-wrap">
        <div
          v-for="item in listData"
          :key="item.label"
          class="min-w-1/10 p-[5px] bg-gray-50 h-[30px] mx-[10px] flex items-center justify-between mb-[5px]"
        >
          <p class="mr-[5px] overflow-hidden overflow-ellipsis whitespace-nowrap">
            {{ item.label }}
          </p>
          <close-circle-outlined
            v-if="!props.canbeEdit"
            class="text-gray-300 ml-[5px] cursor-pointer"
            @click="handleRemove(item)"
          />
        </div>
      </div>

      <div
        class="w-full h-[30px] flex items-center justify-end text-[#ff4d4f] text-right absolute bottom-0 right-0"
      >
        <a-button v-if="!props.canbeEdit" size="small" type="link" danger @click="handleRemoveAll">
          清空选择
        </a-button>
      </div>
    </div>
    <div
      v-else
      class="w-auto h-[160px] border border-gray-500/20 flex justify-start flex-wrap py-[10px]"
    >
      <a-empty class="w-full" :image="simpleImage">
        <template #description>
          <span>暂无选择单位</span>
        </template>
      </a-empty>
    </div>
    <div v-if="!props.canbeEdit" class="w-auto mt-[10px]">
      <div class="my-3 search">
        <a-input
          v-model:value="keyword"
          placeholder="请输入关键字进行搜索"
          allow-clear
          @change="debounceHandleSearchClick"
        />
      </div>
      <h3 class="font-600 my-3">
        单位名称
      </h3>
      <div class="check-box pr-5">
        <template v-if="organizationData?.length">
          <a-checkbox
            v-for="item in organizationData"
            :key="item.orgId"
            v-model:checked="item.checked"
            :value="item.orgId"
            :name="item.orgTreeNamePathMapping"
            @change="handleCheckChange"
          >
            {{ item.orgTreeNamePathMapping }}
          </a-checkbox>
          <a-pagination
            v-model:current="pageNum"
            v-model:page-size="pageSize"
            class="mt-2"
            :total="total"
            :show-total="(total: number) => `共 ${total} 条`"
            size="small"
          />
        </template>
        <template v-else>
          <a-empty class="w-full" :image="simpleImage">
            <template #description>
              <span>暂无相关单位</span>
            </template>
          </a-empty>
        </template>
      </div>
    </div>
  </a-card>
</template>

<style lang="less" scoped>
.check-box {
  :deep(.ant-checkbox-wrapper) {
    width: 100%;
    margin-left: 0;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  :deep(.ant-checkbox-wrapper::after) {
    display: none;
  }

  :deep(.ant-pagination) {
    text-align: right;
  }
}
</style>
