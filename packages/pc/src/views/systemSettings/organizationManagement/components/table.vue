<script setup lang="ts">
import { useElementSize, useToggle } from '@vueuse/core'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { SelectValue } from 'ant-design-vue/es/select'
import type { Key } from 'ant-design-vue/es/table/interface'
import type { ColumnType } from 'ant-design-vue/lib/table'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import {
  postBatchExportLock,
  postDeleteOrgMemberById,
  postDestroyUser,
  postOrgChangeStatus,
} from '@/api/system/organization'
import { customDelay, customPaginationOptions, titleAndPaginationHeight } from '@/common/js/config'
import deleteModal from '@/components/deleteModal.vue'
import secretKeyModal from '@/components/secretKey.vue'
import type { ITableList, ITreeSelect } from '@/interface/system/organization'
import type { TablePageChange } from '@/interface/system/roleManage'
import { useOrgTableStore } from '@/stores/innerOrganization'
import { download } from '@/utils/download'
import { phoneFormat } from '@/utils/format'
import { sm4Encrypt } from '@/utils/gmCrypto'

import InactiveUserList from './InactiveUserList/index.vue'
import detailDialog from './detailDialog.vue'
import RoleStatusModal from './roleStatusModal.vue'

const emits = defineEmits(['addOrEditListEmit', 'editListEmit'])
const orgTableStore = useOrgTableStore()
const { orgTableList, loading, total } = storeToRefs(orgTableStore)
// const { SecretKey } = useSecretKeyStore()
const validityPeriodType = ref<number | null>(null)
const secretKeyType = ref('')
const [keyInput, keyInputToggle] = useToggle(true)
const secretKeyPhone = ref('')
const secretKeyIdCard = ref('')
const secretKeyIndex = ref<number>()
const [roleStatusVisible, changeRoleStatusVisible] = useToggle(false)
const [roleStatusLoading, changeRoleStatusLoading] = useToggle(false)
const [isBatch, changeIsBatch] = useToggle(false)
const [detailDialogOpen, openDetailDialogToggle] = useToggle(false)
const [InactiveUserVis, InactiveUserVisChange] = useToggle(false)
const roleStatusTitle = ref<string>()
// 列表状态显示枚举
enum EStatus {
  nomarl = '开启',
  close = '锁定',
}
const btnText: Record<number, EStatus> = {
  0: EStatus.close,
  1: EStatus.nomarl,
} as const
const roleStatusRef = ref<InstanceType<typeof RoleStatusModal>>()
const pageNum = ref(1)
const pageSize = ref(10)
const detailData = ref({})
const columns: ColumnType[] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    customRender: ({ index }: { index: number }) => {
      return `${index + 1 + (pageNum.value - 1) * pageSize.value}`
    },
    fixed: 'left',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 80,
    fixed: 'left',
  },
  // {
  //   title: '联系电话',
  //   dataIndex: 'phone',
  //   key: 'phone',
  //   width: 120,
  // },
  {
    title: 'i国网账号',
    dataIndex: 'account',
    key: 'account',
    width: 100,
  },
  {
    title: '账号类型',
    dataIndex: 'validityPeriodType',
    key: 'validityPeriodType',
    width: 100,
  },
  {
    title: '有限期',
    key: 'expirationDate',
    dataIndex: 'expirationDate',
    width: 100,
  },
  {
    title: '所属组织',
    dataIndex: 'orgTreeNamePathMapping',
    key: 'orgTreeNamePathMapping',
    ellipsis: true,
    width: 160,
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 100,
  },
  // {
  //   title: '锁定时长',
  //   key: 'lockDurationDate',
  //   dataIndex: 'lockDurationDate',
  //   width: 100,
  // },
  {
    title: '最后登录时间',
    key: 'lastLoginTime',
    dataIndex: 'lastLoginTime',
    width: 130,
  },
]
const tableKeyword = ref('')
const memberTable = ref(null)
const { height } = useElementSize(memberTable)
const scrollHeight = computed(() => {
  return height.value - titleAndPaginationHeight.common
})

const roleStatusSelect = ref<number | null>(null)
const roleStatusList = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '正常',
    value: 0,
  },
  {
    label: '锁定',
    value: 1,
  },
  {
    label: '注销',
    value: 2,
  },
]
const validityPeriodTypeList = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '永久账号',
    value: 0,
  },
  {
    label: '临时账号',
    value: 1,
  },
]
const orgId = ref('')
const userIds = ref<string[]>([])
const deleteId = ref('')
const tableUserId = ref('')
const pagination = computed(() => ({
  total: total.value,
  current: pageNum.value,
  pageSize: pageSize.value,
  ...customPaginationOptions,
}))

// page变化
// function handleTableChange({
//   current,
//   pageSize: pageSizeValue,
// }: TablePageChange) {

// }
function handleTableChange({ current, pageSize: pageSizeValue }: TablePageChange) {
  pageNum.value = current ?? 1
  pageSize.value = pageSizeValue ?? 10
  refresh()
}

// 删除数据
const [delVisible, delVisibleToggle] = useToggle()
const [delLoading, delLoadingToggle] = useToggle()
const warningTitle = ref('')
const warningHint = ref('')
const warningMess = ref('')
const warnStatus = ref('')

function openSingleDelModal(id: string) {
  warnStatus.value = 'single'
  warningTitle.value = '删除操作'
  warningMess.value = '你确定需要删除此数据么？'
  warningHint.value = '请确保该角色是否被账号使用，若删除后数据将无法恢复'
  delVisibleToggle(true)
  deleteId.value = id
}

function openBatchDelModal() {
  if (userIds.value.length === 0) {
    message.warning('请先选择账号')
    return
  }
  warningTitle.value = '删除操作'
  warnStatus.value = 'all'
  warningMess.value = '你确定需要删除这些数据么？'
  warningHint.value = '请确保这些角色是否被账号使用，若删除后数据将无法恢复'
  delVisibleToggle(true)
}

function handleDeleteCancel() {
  delVisibleToggle(false)
  delLoadingToggle(false)
  warnStatus.value = ''
  warningTitle.value = ''
  warningMess.value = ''
  warningHint.value = ''
  deleteId.value = ''
}

async function handleDeleteClick() {
  delLoadingToggle(true)
  const params = {
    userIds: [deleteId.value],
  }
  const [, err] = await to(postDeleteOrgMemberById(params))

  if (!err) {
    message.success('删除成功')
    userIds.value = []
    pageNum.value = 1
    refresh()
  }
  else {
    message.error(err.message)
  }
  handleDeleteCancel()
}

async function handleDeleteAllMember() {
  delLoadingToggle(true)
  const params = {
    userIds: userIds.value,
  }
  const [, err] = await to(postDeleteOrgMemberById(params))

  if (!err) {
    message.success('删除成功')
    userIds.value = []
    pageNum.value = 1
    refresh()
  }
  else {
    message.error(err.message ?? '删除失败')
  }
  handleDeleteCancel()
}

async function handleDeregistration() {
  delLoadingToggle(true)
  const params = {
    userId: deleteId.value,
  }
  const [, err] = await to(postDestroyUser(params))

  if (!err) {
    message.success('注销成功')
    pageNum.value = 1
    refresh()
  }
  else {
    message.error(err.message ?? '注销失败')
  }
  handleDeleteCancel()
}

function handleDeleteConfirm() {
  switch (warnStatus.value) {
    case 'single':
      handleDeleteClick()
      break
    case 'all':
      handleDeleteAllMember()
      break
    case 'deregistration':
      handleDeregistration()
      break

    default:
      break
  }
}

function rowSelection(selectedRowKeys: Key[]): void {
  userIds.value = selectedRowKeys as string[]
}

function handleAddOrEditListClick(isEdit = false, record?: ITableList) {
  emits('addOrEditListEmit', isEdit, record)
}

// 单独改变状态
function handleChangeStatus(userId: string, status: number) {
  tableUserId.value = userId
  changeIsBatch(false)
  roleStatusTitle.value = status ? btnText[1] : btnText[0]
  changeRoleStatusVisible(true)
}

// 批量改变状态
async function handleChangeAllStatus(type: number) {
  if (userIds.value.length === 0) {
    message.warning('请先选择账号')
    return
  }
  changeIsBatch(true)
  const params = {
    status: 1,
    userIds: userIds.value,
  }
  // 批量开启
  if (type === 0)
    params.status = 0
  roleStatusTitle.value = type ? btnText[0] : btnText[1]
  changeRoleStatusVisible(true)
}

const statusConfirmEmit = async (val: { [key: string]: number }) => {
  changeRoleStatusLoading(true)
  const { lockDuration, lockType, validDuration, validityPeriodType } = val
  const params = {
    userIds: isBatch.value ? userIds.value : [tableUserId.value],
    status: roleStatusTitle.value === btnText[1] ? 0 : 1,
  }
  if (roleStatusTitle.value === btnText[1])
    Object.assign(params, { validDuration, validityPeriodType })
  else Object.assign(params, { lockDuration, lockType })
  const [, err] = await to(postOrgChangeStatus(params))

  if (!err) {
    message.success('状态更改成功')
    roleStatusRef.value?.resetForm()
    refresh()
  }
  else {
    message.error(err.message)
  }
  changeRoleStatusVisible(false)
  changeRoleStatusLoading(false)
}

const statusCancelEmit = () => {
  tableUserId.value = ''
  roleStatusRef.value?.resetForm()
  changeRoleStatusVisible(false)
}

function refresh() {
  const params = {
    orgId: orgId.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    status: roleStatusSelect.value,
    keyword: tableKeyword.value,
    validityPeriodType: validityPeriodType.value,
  }
  orgTableStore.getTableListAction({
    ...params,
    status: params.status || 0,
  })
}

function openDeregistrationModal(id: string) {
  warnStatus.value = 'deregistration'
  warningTitle.value = '注销操作'
  warningMess.value = '你确定需要注销该账号么？'
  warningHint.value = '此账号注销后其数据将无法恢复，请谨慎操作！'
  delVisibleToggle(true)
  deleteId.value = id
}

function selectOrgGetTableList(orgParams: ITreeSelect) {
  tableKeyword.value = orgParams.memberName
  orgId.value = orgParams.orgId
  pageNum.value = 1
  pageSize.value = 10
  tableUserId.value = ''
  refresh()
}

// watch(
//   () => orgId.value,
//   (newValue) => {
//     orgId.value = newValue
//     refresh()
//     console.log(9, newValue)
//   },
// )
const handleBatchExport = async () => {
  const [data, err] = await to(postBatchExportLock())
  if (!err)
    download('不活跃账号.xlsx', 'blob', data as Blob)
}

const handleChangeSecret = (index: number, secret: string, type: string) => {
  if (orgTableList.value && orgTableList.value[index][type]) {
    orgTableList.value[index][type] = false
  }
  else {
    secretKeyType.value = type
    secretKeyIndex.value = index

    if (type === 'phoneVisible') {
      secretKeyPhone.value = secret
      secretKeyIdCard.value = ''
    }
    else {
      secretKeyPhone.value = ''
      secretKeyIdCard.value = secret
    }
    keyInputToggle(true)
  }
}

const secretKeyConfirm = ({ phone }: { phone: string }) => {
  if (!orgTableList.value)
    return
  const decryptPhone = atob(phone)
  orgTableList.value[secretKeyIndex.value as number].phone = sm4Encrypt(decryptPhone)
  orgTableList.value[secretKeyIndex.value as number][secretKeyType.value] = true
}

// function openDetailDialog(record: ITableList) {
//   detailData.value = record
//   openDetailDialogToggle(true)
// }

defineExpose({
  selectOrgGetTableList,
  refresh,
})
</script>

<template>
  <div class="h-full w-full">
    <h3 class="font-600 mb-3">
      账号列表
    </h3>
    <div v-if="orgId" class="btn flex justify-between">
      <a-space>
        <a-input
          v-model:value="tableKeyword"
          class="h-40px"
          placeholder="请输入关键字"
          @change="() => refresh()"
        />
        <a-select
          v-model:value="validityPeriodType as SelectValue"
          placeholder="账号类型"
          class="min-w-100px"
          size="small"
          @change="() => refresh()"
        >
          <template v-for="item in validityPeriodTypeList" :key="item.value">
            <a-select-option :value="item.value">
              {{ item.label }}
            </a-select-option>
          </template>
        </a-select>
        <a-select
          v-model:value="roleStatusSelect as SelectValue"
          placeholder="账号状态"
          class="min-w-100px"
          size="small"
          @change="() => refresh()"
        >
          <template v-for="item in roleStatusList" :key="item.value">
            <a-select-option :value="item.value">
              {{ item.label }}
            </a-select-option>
          </template>
        </a-select>
      </a-space>
      <a-space>
        <a-popover placement="bottom">
          <template #content>
            <a-space direction="vertical">
              <p
                v-permission="['button_contact_department_delete']"
                class="cursor-pointer hover"
                @click.stop="openBatchDelModal"
              >
                批量删除
              </p>
              <p
                v-permission="['button_contact_department_status']"
                class="cursor-pointer hover"
                @click.stop="handleChangeAllStatus(1)"
              >
                批量锁定
              </p>
              <p
                v-permission="['button_contact_department_status']"
                class="cursor-pointer hover"
                @click.stop="handleChangeAllStatus(0)"
              >
                批量开启
              </p>
            </a-space>
          </template>
          <a-button type="primary" size="small" ghost>
            批量操作
          </a-button>
        </a-popover>
        <a-button
          v-permission="['button_contact_department_add']"
          type="primary"
          size="small"
          ghost
          @click="handleAddOrEditListClick(false)"
        >
          新增
        </a-button>
        <a-button
          v-permission="['button_contact_department_locked_user_export']"
          type="primary"
          size="small"
          ghost
          @click="InactiveUserVisChange(true)"
        >
          不活跃账号
        </a-button>
      </a-space>
    </div>
    <div ref="memberTable" class="tableContent">
      <a-table
        size="small"
        bordered
        sticky
        :columns="columns"
        :data-source="orgTableList"
        :loading="{ spinning: loading, delay: customDelay }"
        :pagination="pagination"
        :scroll="{ x: '100', y: scrollHeight }"
        :row-selection="{ selectedRowKeys: userIds, onChange: rowSelection }"
        row-key="userId"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text, index }">
          <template v-if="column.key === 'name'">
            <a>
              {{ record.name }}
            </a>
          </template>
          <template v-if="column.key === 'orgTreeNamePathMapping'">
            <div v-for="item in record.departmentInfo" :key="item.deptId">
              <a-tooltip>
                <template #title>
                  {{ item.orgTreeNamePathMapping }}
                </template>
                <div class="my-1 truncate">
                  {{ item.orgTreeNamePathMapping }}
                </div>
              </a-tooltip>
            </div>
          </template>
          <template v-if="column.key === 'roleName'">
            <div>
              <template v-for="item in record.roleInfo" :key="item.id">
                <a-tag class="max-w-full my-[2px] truncate">
                  {{ item.roleName }}
                </a-tag>
              </template>
            </div>
          </template>
          <template v-if="column.key === 'validityPeriodType'">
            <div v-if="record.validityPeriodType === 0">
              永久
            </div>
            <div v-if="record.validityPeriodType === 1">
              临时
            </div>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag v-if="record.statusCode === 0" color="success">
              {{ record.statusValue }}
            </a-tag>
            <a-tag v-if="record.statusCode === 1" color="error">
              {{ record.statusValue }}
            </a-tag>
            <a-tag v-if="record.statusCode === 2" color="warning">
              {{ record.statusValue }}
            </a-tag>
          </template>
          <template v-if="column.dataIndex === 'expirationDate'">
            <span v-if="!record.expirationDate">永久</span>
            <span v-else>
              {{ dayjs(Number(record.expirationDate)).format('YYYY-MM-DD HH:mm') }}
            </span>
          </template>
          <template v-if="column.dataIndex === 'lastLoginTime'">
            <span>{{ dayjs(Number(record.lastLoginTime)).format('YYYY-MM-DD HH:mm') }}</span>
          </template>
          <template v-else-if="column.key === 'operation'">
            <span v-if="record.statusCode !== 2" class="actions">
              <a-button
                v-permission="['button_contact_department_edit']"
                class="px-0"
                type="link"
                @click="handleAddOrEditListClick(true, record as ITableList)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="['button_contact_department_status']"
                class="px-0"
                type="link"
                @click="handleChangeStatus(record.userId, record.statusCode)"
              >
                {{ btnText[record.statusCode as number] }}
              </a-button>
              <a-button
                v-permission="['button_contact_department_destroy']"
                class="px-0"
                type="link"
                danger
                @click="openDeregistrationModal(record.userId)"
              >
                注销</a-button>
              <a-button
                v-permission="['button_contact_department_delete']"
                class="px-0"
                type="link"
                danger
                @click="openSingleDelModal(record.userId)"
              >
                删除
              </a-button>
            </span>
          </template>

          <template v-else-if="column.dataIndex === 'phone'">
            <span class="cursor-pointer" @click="handleChangeSecret(index, text, 'phoneVisible')">
              {{ phoneFormat(!record.phoneVisible, text) }}
              <template v-if="text.length">
                <eye-outlined v-if="record.phoneVisible" />
                <eye-invisible-outlined v-else />
              </template>
            </span>
          </template>
        </template>
      </a-table>
    </div>
    <deleteModal
      :visible="delVisible"
      :loading="delLoading"
      :title="warningTitle"
      :hint="warningHint"
      :message="warningMess"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
    <RoleStatusModal
      ref="roleStatusRef"
      :status-visible="roleStatusVisible"
      :title="roleStatusTitle"
      :is-batch="isBatch"
      :loading="roleStatusLoading"
      @status-cancel-emit="statusCancelEmit"
      @status-confirm-emit="statusConfirmEmit"
    />
    <secretKeyModal
      :visible="keyInput"
      title="查看"
      :secret-key-type="secretKeyType"
      :secret-key-phone="secretKeyPhone"
      :secret-key-id-card="secretKeyIdCard"
      @cancel="keyInputToggle(false)"
      @confirm="secretKeyConfirm"
    />
    <detailDialog
      :visible="detailDialogOpen"
      :detail-data="detailData as ITableList"
      @close="openDetailDialogToggle(false)"
    />
    <InactiveUserList v-model="InactiveUserVis" @export="handleBatchExport" />
  </div>
</template>

<style lang="less" scoped>
.tableContent {
  height: calc(100% - 36px);
  overflow-y: hidden;
  margin-top: 10px;

  :deep(.ant-spin-nested-loading) {
    > div:first-of-type {
      position: unset;
    }
  }
  :deep(.ant-popover-inner) {
    width: 120px;
  }
}
.actions {
  :deep(.ant-btn::after) {
    content: ' | ';
    display: inline-block;
    margin: 0 8px;
    color: #e5e7eb;
  }
  :deep(.ant-btn:last-child::after) {
    content: '';
  }
}
.cursor-pointer {
  padding: 5px;
}
</style>
