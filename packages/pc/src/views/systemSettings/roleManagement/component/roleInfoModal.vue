<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { FormInstance, RadioChangeEvent } from 'ant-design-vue'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import { computed, ref, watch } from 'vue'

import useUser from '@/hooks/useUser'
import { DATA_PERMISSION_TYPE, FEATURES_PERMISSIONS_TYPE, ROLE_TYPE } from '@/interface/system/roleManage'
import type {
  BasicDepartmentInfo,
  FormatPermissionList,
  PermissionTreeData,
  RoleBasicMessage,
} from '@/interface/system/roleManage'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  roleInfoInEdit: {
    type: Object,
    default: () => {},
  },
  allPermissions: {
    type: Array<FormatPermissionList>,
    default: () => [],
  },
  permissionType: {
    type: Number,
    default: null,
  },
  permissionsUnitIdList: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['close', 'addRole'])
enum STEP_TYPE {
  roleInfo = '下一步',
  dataPermission = '下一步 ',
  permissionAssign = '确定',
}
const activeKey = ref<'roleInfo' | 'dataPermission' | 'permissionAssign'>('roleInfo')
const formState = ref<RoleBasicMessage>({
  roleName: '',
  id: '',
  remark: '',
})
const formRef = ref<FormInstance>()
const { user } = useUser()
const unitIdList = ref<BasicDepartmentInfo[]>([])
const dataSource = ref<FormatPermissionList[]>([])
const dataSourceWithoutDepartment = ref<FormatPermissionList[]>([])
const selectDataPermission = ref<number | null>(null)

watch(
  () => props.roleInfoInEdit,
  (val) => {
    formState.value = pick(val, 'roleName', 'id', 'remark')
  },
)
watch(
  () => props.permissionType,
  (val) => {
    selectDataPermission.value = val
  },
)
watch(
  () => props.allPermissions,
  (val) => {
    dataSource.value = rowSpan(val, 'firstMenu')
    const notContainDepartment = val.filter(
      item => item.secondMenu.self.code !== 'menu_contact_department',
    )
    dataSourceWithoutDepartment.value = rowSpan(notContainDepartment, 'firstMenu')
  },
)
watch(
  () => props.permissionsUnitIdList,
  (val) => {
    unitIdList.value = val as BasicDepartmentInfo[]
  },
)

interface CellData extends FormatPermissionList {
  firstMenuRowSpan: number
}

const columns = [
  {
    title: '一级菜单',
    dataIndex: 'firstMenu',
    key: 'firstMenu',
    customCell(_: CellData) {
      return { rowSpan: _.firstMenuRowSpan }
    },
    width: 150,
  },
  {
    title: '二级菜单',
    dataIndex: 'secondMenu',
    key: 'secondMenu',
    width: 150,
  },
  {
    title: '操作功能',
    dataIndex: 'actions',
    key: 'actions',
  },
]

function rowSpan(data: FormatPermissionList[], key: string) {
  const mergeRowspan = data
    .reduce((result: string[], item: FormatPermissionList) => {
      if (!result.includes(item.firstMenu.name))
        result.push(item.firstMenu.name)

      return result
    }, [])
    .reduce((result: FormatPermissionList[], keys: string) => {
      const children = data.filter((item: FormatPermissionList) => item.firstMenu.name === keys)
      result = result.concat(
        children.map((item: FormatPermissionList, index: number) => ({
          ...item,
          [`${key}RowSpan`]: index === 0 ? children.length : 0,
        })),
      )
      return result
    }, [])
  return mergeRowspan
}
const currentPeremissionAssignList = computed(() =>
  selectDataPermission.value === DATA_PERMISSION_TYPE.individual
    ? dataSourceWithoutDepartment.value
    : dataSource.value,
)

function firstMenuStatus(id: string) {
  const rowspanData = currentPeremissionAssignList.value.filter((item: FormatPermissionList) => item.firstMenu.id === id)
  return rowspanData.some((item: FormatPermissionList) => item.secondMenu.value)
}

function getPermissionBySelect(data: FormatPermissionList[]) {
  const result: string[] = []
  data.forEach((item) => {
    if (item.firstMenu.value)
      result.push(item.firstMenu.id)

    if (!isEmpty(item.secondMenu) && item.secondMenu.value)
      result.push(item.secondMenu.id)

    if (item.actions.length) {
      const actionsList = item.actions.filter(arg => arg.value)
      if (actionsList.length)
        actionsList.forEach(sec => result.push(sec.id))
    }
  })
  return uniq(result)
}

function tapConfirm() {
  if (formState.value.id)
    handleOkByEdit()
  else
    handleOkByAdd()
}

function handleOkByEdit() {
  formRef.value
    ?.validate()
    .then(() => {
      checkPermissionAssign()
    })
    .catch(() => {
      activeKey.value = 'roleInfo'
      message.warning('请先完善信息')
    })
}

function handleOkByAdd() {
  switch (activeKey.value) {
    case 'roleInfo':
      formRef.value
        ?.validate()
        .then(() => {
          activeKey.value = 'dataPermission'
        })
        .catch(() => {
          message.warning('请先完善信息')
        })
      break
    case 'dataPermission':
      activeKey.value = 'permissionAssign'
      break
    case 'permissionAssign':
      formRef.value
        ?.validate()
        .then(() => {
          checkPermissionAssign()
        })
        .catch(() => {
          activeKey.value = 'roleInfo'
          message.warning('请先完善信息')
        })
      break
    default:
      break
  }
}

function checkPermissionAssign() {
  const result = getPermissionBySelect(currentPeremissionAssignList.value)

  if (result.length) {
    const ids = unitIdList.value.map(item => item.deptId)
    const param = {
      dataPermissionType: selectDataPermission.value,
      webPermissionIds: result,
      ...formState.value,
      dynamicDataPermissionRef: {
        departmentIds: selectDataPermission.value === DATA_PERMISSION_TYPE.unit ? ids : [],
      },
    }
    emits('addRole', param)
  }
  else {
    activeKey.value = 'permissionAssign'
    message.warning('权限分配中至少选择一项菜单权限')
  }
}

function beforeCancel() {
  activeKey.value = 'roleInfo'
  unitIdList.value = []
}

function handleCancel() {
  beforeCancel()
  emits('close')
}

function permissionChange(e: RadioChangeEvent) {
  const target = e.target as HTMLInputElement
  selectDataPermission.value = target.value as unknown as number
}

function handleChangeFirstMenu(record: FormatPermissionList) {
  const id = record.firstMenu.id
  const exist = currentPeremissionAssignList.value.filter(
    (item: FormatPermissionList) => item.firstMenu.id === id && !item.secondMenu.value,
  )
  changeStatus(id, !!exist.length)
}

function changeStatus(id: string, status: boolean) {
  currentPeremissionAssignList.value.forEach((item: FormatPermissionList) => {
    if (item.firstMenu.id === id) {
      item.firstMenu.value = status
      if (!isEmpty(item.secondMenu))
        item.secondMenu.value = status

      if (item.actions.length)
        item.actions.forEach(sec => (sec.value = status))
    }
  })
}

function handleChangeSecondMenu(record: FormatPermissionList) {
  record.secondMenu.value = !record.secondMenu.value
  record.firstMenu.value = record.secondMenu.value
  record.actions.forEach(sec => (sec.value = record.secondMenu.value))
}

function handleChangeActions(record: FormatPermissionList, data: PermissionTreeData) {
  data.value = !data.value
  const exist = record.actions.some(item => item.value)
  record.firstMenu.value = exist
  record.secondMenu.value = exist
  const index = record.actions.findIndex(item => item.name === FEATURES_PERMISSIONS_TYPE.view)
  record.actions[index].value = exist
}

function viewActionsStatus(record: FormatPermissionList, data: PermissionTreeData) {
  if (data.name === FEATURES_PERMISSIONS_TYPE.view)
    return record.secondMenu.value

  return data.value
}

function dynamicTitle() {
  if (formState.value.id) {
    if (props.roleInfoInEdit.roleType === ROLE_TYPE.system)
      return '查看角色'

    return '编辑角色'
  }
  else {
    return '新增角色'
  }
}

function canBeCheckCompany() {
  const isUnit = user.value?.dataPermissionType === DATA_PERMISSION_TYPE.unit
  const isIndividual = user.value?.dataPermissionType === DATA_PERMISSION_TYPE.individual
  return isUnit || isIndividual
}

function canBeCheckUnit() {
  const isIndividual = user.value?.dataPermissionType === DATA_PERMISSION_TYPE.individual
  return isIndividual
}

function dynamicConfirmText() {
  return formState.value.id ? '确定' : STEP_TYPE[activeKey.value]
}
</script>

<template>
  <a-modal
    :open="props.visible"
    width="50%"
    :mask-closable="false"
    :body-style="{ height: '60vh' }"
    centered
    :after-close="beforeCancel"
    :title="dynamicTitle()"
    @cancel="handleCancel"
  >
    <a-tabs v-model:activeKey="activeKey" class="h-full">
      <a-tab-pane key="roleInfo" tab="角色信息">
        <a-form ref="formRef" layout="vertical" :model="formState" class="mx-auto">
          <a-form-item
            label="名称"
            name="roleName"
            :rules="[{ required: true, message: '请输入角色名称' }]"
          >
            <a-input
              v-model:value="formState.roleName"
              placeholder="请输入角色名称"
              :maxlength="16"
              show-count
              oninput="value=value.replace(/[, ]/g,'')"
              onkeyup="value=value.replace(/[, ]/g,'')"
              :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
            />
          </a-form-item>
          <a-form-item v-show="formState.id" label="ID" name="id">
            <a-input v-model:value="formState.id" disabled />
          </a-form-item>
          <a-form-item label="备注" name="remark">
            <a-textarea
              v-model:value="formState.remark"
              placeholder="请输入备注"
              show-count
              :maxlength="250"
              :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
            />
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="dataPermission" tab="数据权限" :disabled="!formState.roleName">
        <a-radio-group
          :value="selectDataPermission"
          :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
          @change="permissionChange"
        >
          <a-radio :value="8" :disabled="canBeCheckCompany()">
            全公司数据
          </a-radio>
          <a-radio :value="4" :disabled="canBeCheckUnit()">
            单位数据
          </a-radio>
          <a-radio :value="1">
            仅本人数据
          </a-radio>
        </a-radio-group>
        <!-- <div
          v-if="selectDataPermission === DATA_PERMISSION_TYPE.unit"
          class="h-[calc(60vh-110px)] overflow-hidden pb-2"
        >
          <UnitDataModal
            :unit-list="unitIdList"
            :canbe-edit="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
            @handleSelect="selectUnitList"
          />
        </div> -->
      </a-tab-pane>
      <a-tab-pane key="permissionAssign" tab="权限分配" :disabled="!formState.roleName">
        <div class="h-[calc(60vh-110px)] overflow-y-auto">
          <a-table
            class="bg-[#fff] py-[10px]"
            :columns="columns"
            :data-source="
              selectDataPermission === DATA_PERMISSION_TYPE.individual
                ? dataSourceWithoutDepartment
                : dataSource
            "
            bordered
            center
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'firstMenu'">
                <a-checkbox
                  :checked="firstMenuStatus(record.firstMenu.id)"
                  :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
                  @change="handleChangeFirstMenu(record as FormatPermissionList)"
                >
                  {{ record.firstMenu.name }}
                </a-checkbox>
              </template>
              <template v-if="column.dataIndex === 'secondMenu'">
                <a-checkbox
                  v-if="record.secondMenu.name"
                  :checked="record.secondMenu.value"
                  :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
                  @change="handleChangeSecondMenu(record as FormatPermissionList)"
                >
                  {{ record.secondMenu.name }}
                </a-checkbox>
              </template>
              <template v-if="column.dataIndex === 'actions'">
                <a-row :gutter="20">
                  <a-col v-for="(item, index) in record.actions" :key="index">
                    <a-checkbox
                      :checked="viewActionsStatus(record as FormatPermissionList, item)"
                      :disabled="
                        item.name === FEATURES_PERMISSIONS_TYPE.view
                          || props.roleInfoInEdit.roleType === ROLE_TYPE.system
                      "
                      @change="handleChangeActions(record as FormatPermissionList, item)"
                    >
                      {{ item.name }}
                      <a-tooltip
                        v-if="item.name === FEATURES_PERMISSIONS_TYPE.add && record.secondMenu.name === '全部培训'"
                        placement="topLeft" title="仅具备对培训信息的新增权限，不具备对学员信息、课程信息、培训资料、其他信息的新增权限" arrow-point-at-center
                      >
                        <question-circle-outlined />
                      </a-tooltip>
                      <a-tooltip
                        v-if="item.name === FEATURES_PERMISSIONS_TYPE.add && record.secondMenu.name === '全部会议'"
                        placement="topLeft" title="仅具备对基础信息的新增权限，不具备对会议成员、会议议程、会议资料、其他信息的新增权限" arrow-point-at-center
                      >
                        <question-circle-outlined />
                      </a-tooltip>
                    </a-checkbox>
                  </a-col>
                </a-row>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <template #footer>
      <a-button @click="handleCancel">
        取消
      </a-button>
      <a-button
        ghost
        type="primary"
        :loading="props.loading"
        :disabled="props.roleInfoInEdit.roleType === ROLE_TYPE.system"
        @click="tapConfirm"
      >
        {{ dynamicConfirmText() }}
      </a-button>
    </template>
  </a-modal>
</template>

<style lang="less" scoped>
:deep(.ant-input-textarea) {
  height: 120px;
}
</style>
