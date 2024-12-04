<script setup lang="ts">
import type { ITableList } from '@/interface/system/organization'

const props = defineProps<{
  visible: boolean
  detailData: ITableList
}>()
const emits = defineEmits(['close'])

function formatterType(type: number) {
  let account = ''
  if (type === 0)
    account = '永久账号'

  if (type === 1)
    account = '临时账号'

  return account
}
</script>

<template>
  <a-modal
    :open="props.visible"
    width="50%"
    :mask-closable="false"
    :body-style="{ height: '400px' }"
    centered
    title="成员详情"
    :footer="null"
    @cancel="emits('close')"
  >
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        姓名:
      </div>
      <div>{{ props.detailData.name }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        ID:
      </div>
      <div>{{ props.detailData.name }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        i国网账号:
      </div>
      <div>{{ props.detailData.account }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        所属组织:
      </div>
      <div>{{ props.detailData.orgTreeNamePathMapping }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        所属角色:
      </div>
      <div>{{ props.detailData.roleName }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        账号类型:
      </div>
      <div>{{ formatterType(props.detailData.validityPeriodType) }}</div>
    </div>
    <div v-if="props.detailData.validityPeriodType === 1" class="flex items-center justify-start mb-10px">
      <div class="label">
        截止时间:
      </div>
      <div>{{ props.detailData.expirationDate }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        创建时间:
      </div>
      <div>{{ props.detailData.createTime }}</div>
    </div>
    <div class="flex items-center justify-start mb-10px">
      <div class="label">
        更新时间:
      </div>
      <div>{{ props.detailData.lastLoginTime }}</div>
    </div>
  </a-modal>
</template>

<style lang="less" scoped>
.label {
    width: 100px;
    text-align: right;
    margin-right: 10px;
}
</style>
