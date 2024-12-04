<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import isEmpty from 'lodash/isEmpty'
import { reactive, ref, watch } from 'vue'

import { getPermissionList, getRoleDetail, postSaveRole } from '@/api/system/roleManage'
import { FEATURES_PERMISSIONS_TYPE } from '@/interface/system/roleManage'
import type {
  CellData,
  FormatPermissionList,
  ISaveRole,
  PermissionTreeData,
} from '@/interface/system/roleManage'

// 定义自定义列的类型
interface CustomColumns<T> {
  title: string
  dataIndex: keyof T
  key: keyof T
  customCell?: (data: CellData) => any
  width?: number
  align?: 'left' | 'center' | 'right'
}

const emits = defineEmits(['addRefresh'])
const formRef = ref<FormInstance>()
const [visible, changeVisible] = useToggle(false)
const [saveLoading, changeSaveLoading] = useToggle(false)
const [detailLoading, detailLoadingVis] = useToggle(false)
const activeKey = ref('roleInfo')
const roleFormState = reactive<ISaveRole>({
  remark: '',
  status: 0,
  roleName: '',
})
const isEditShow = ref(false)
const roleId = ref('')
const dataSource = ref<FormatPermissionList[]>([])
const allPermissions = ref<FormatPermissionList[]>([])

const rowSpan = (key: string) => {
  const groupMap = dataSource.value.reduce((acc, item) => {
    const groupName = item.firstMenu.name
    const group = acc.get(groupName) || []
    group.push(item)
    acc.set(groupName, group)
    return acc
  }, new Map<string, FormatPermissionList[]>())

  const result: FormatPermissionList[] = []
  groupMap.forEach((groupItems) => {
    for (let i = 0; i < groupItems.length; i++) {
      result.push({
        ...groupItems[i],
        [`${key}RowSpan`]: i === 0 ? groupItems.length : 0,
      })
    }
  })

  dataSource.value = result
}

const columns: CustomColumns<FormatPermissionList>[] = [
  {
    title: '一级菜单',
    dataIndex: 'firstMenu',
    key: 'firstMenu',
    customCell(_: CellData) {
      return { rowSpan: _.firstMenuRowSpan }
    },
    width: 150,
    align: 'center',
  },
  {
    title: '二级菜单',
    dataIndex: 'secondMenu',
    key: 'secondMenu',
    width: 180,
    align: 'center',
  },
  {
    title: '操作功能',
    dataIndex: 'actions',
    key: 'actions',
    align: 'center',
  },
]

watch(
  () => allPermissions.value,
  (val) => {
    dataSource.value = val as FormatPermissionList[]
    rowSpan('firstMenu')
  },
)

const formatRoleInfo = (permissionList: PermissionTreeData[]) => {
  return permissionList.reduce((result: FormatPermissionList[], item) => {
    if (item.hasChildren) {
      item.items.forEach((subitem: PermissionTreeData) => {
        const actions = subitem.hasChildren
          ? subitem.items.map(({ self, ...action }) => ({ ...action, self, value: !!self.checked }))
          : []

        result.push({
          firstMenu: { ...item, value: !!item.self.checked },
          secondMenu: { ...subitem, value: !!subitem.self.checked },
          actions,
        })
      })
    }
    else {
      result.push({
        firstMenu: { ...item, value: !!item.self.checked },
        secondMenu: {} as PermissionTreeData,
        actions: [],
      })
    }
    return result
  }, [])
}

const getSelectedPermissionIds = (formattedPermissions: FormatPermissionList[]) => {
  return formattedPermissions.reduce((acc: string[], { firstMenu, secondMenu, actions }) => {
    if (firstMenu.value)
      acc.push(firstMenu.id)
    if (secondMenu.value)
      acc.push(secondMenu.id)
    if (actions.some(({ value }) => value))
      acc.push(...actions.filter(({ value }) => value).map(({ id }) => id))
    return acc
  }, [])
}

// 一级菜单选择
const changeStatus = (id: string, status: boolean) => {
  dataSource.value.forEach((item: FormatPermissionList) => {
    if (item.firstMenu.id === id) {
      item.firstMenu.value = status

      // 为了提高可读性，将条件判断提取为函数
      const setSecondaryMenuStatus = (menu: PermissionTreeData) => {
        if (!isEmpty(menu))
          menu.value = status
      }

      setSecondaryMenuStatus(item.secondMenu)

      // 对于actions数组的遍历和值修改，可以使用forEach或者map，这里使用forEach比较合适
      item.actions.forEach((action) => {
        action.value = status
      })
    }
  })
}

const handleChangeFirstMenu = (record: FormatPermissionList, index: number) => {
  const id = record.firstMenu.id

  // 提前退出循环，减少遍历次数
  const exist = dataSource.value.some((item: FormatPermissionList) => {
    return item.firstMenu.id === id && !item.secondMenu.value
  })
  const hasSecondMenu = record.secondMenu

  if (Object.entries(hasSecondMenu).length)
    changeStatus(id, exist)
  else
    dataSource.value[index].firstMenu.value = !record.firstMenu.value
}

// 二级菜单选择
const handleChangeSecondMenu = (record: FormatPermissionList) => {
  const index = dataSource.value.findIndex(item => item.secondMenu.id === record.secondMenu.id)
  const status = !record.secondMenu.value

  // 更新第二级菜单状态
  dataSource.value[index].secondMenu.value = status

  // 更新第一级菜单状态
  const firstMenuId = record.firstMenu.id
  const matchingMenus = dataSource.value.filter(item => item.firstMenu.id === firstMenuId)
  const firstMenuStatus = matchingMenus.some(item => item.secondMenu.value)

  matchingMenus.forEach((item) => {
    item.firstMenu.value = firstMenuStatus
  })

  dataSource.value[index].actions.forEach((action) => {
    action.value = status
  })
}

const handleChangeActions = (record: FormatPermissionList, action: PermissionTreeData) => {
  const { actions, firstMenu, secondMenu } = record
  const { name } = action

  action.value = !action.value

  const checked = actions.some(({ value }) => value)
  firstMenu.value = checked
  secondMenu.value = checked

  const index = actions.findIndex(
    ({ name: actionName }) => actionName === FEATURES_PERMISSIONS_TYPE.view,
  )

  if (index !== -1 && actions[index].name === name)
    actions[index].value = checked
}

const isViewActionSelected = (record: FormatPermissionList, action: PermissionTreeData) => {
  return action.name === FEATURES_PERMISSIONS_TYPE.view ? record.secondMenu.value : action.value
}

const resetFormData = () => {
  activeKey.value = 'roleInfo'
  roleId.value = ''
  allPermissions.value = []
  changeVisible(false)
  formRef.value?.resetFields()
}

const isRoleInfoIncomplete = (activeKey: string | null): boolean => {
  return activeKey === 'permissionAssign' || activeKey === 'dataPermissions'
}

const handleSubmitClick = async () => {
  try {
    await formRef.value?.validate()

    const selectedPermissionIds = getSelectedPermissionIds(dataSource.value)

    if (!selectedPermissionIds.length) {
      message.warning('请至少选择一个权限')
      return
    }

    changeSaveLoading(true)

    const param = {
      webPermissionIds: selectedPermissionIds,
      id: roleId.value || '',
      ...roleFormState,
    }

    const [, error] = await to(postSaveRole(param))

    if (!error) {
      emits('addRefresh')
      message.success('操作成功')
    }
  }
  catch {
    if (isRoleInfoIncomplete(activeKey.value))
      return message.warning('请先完善角色信息')
  }
  finally {
    changeSaveLoading(false)
    resetFormData()
  }
}

const showModal = async (isEdit: boolean, roleIds?: string) => {
  isEditShow.value = isEdit
  roleId.value = roleIds || ''
  changeVisible(true)
  detailLoadingVis(true)

  if (isEdit && roleIds) {
    const [detailRes, error] = await to(getRoleDetail(roleIds))

    if (!error) {
      const { roleName, remark, status, webPermissions } = detailRes
      Object.assign(roleFormState, { roleName, remark, status })
      allPermissions.value = formatRoleInfo(webPermissions)
    }
  }
  else {
    const [permissionsRes, error] = await to(getPermissionList())

    if (!error) {
      const { webPermissions } = permissionsRes
      allPermissions.value = formatRoleInfo(webPermissions)
    }
  }
  detailLoadingVis(false)
}

defineExpose({
  showModal,
})
</script>

<template>
  <Dialog
    v-model="visible"
    :title="roleId ? '编辑角色' : '新增角色'"
    :config="{ width: '60%', centered: true }"
    @cancel="resetFormData"
  >
    <a-spin :spinning="detailLoading">
      <div>
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane key="roleInfo" tab="角色信息" force-render>
            <div class="h-50vh overflow-y-auto py-2">
              <a-form
                ref="formRef"
                class="form"
                :model="roleFormState"
                name="basic"
                :label-col="{ span: 3 }"
                autocomplete="off"
              >
                <a-form-item
                  label="角色名称"
                  name="roleName"
                  :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
                >
                  <a-input
                    v-model:value="roleFormState.roleName"
                    allow-clear
                    show-count
                    :maxlength="30"
                    placeholder="请输入"
                  />
                </a-form-item>
                <a-form-item
                  label="是否启用"
                  name="status"
                  :rules="[{ required: true, message: '请选择', trigger: 'blur' }]"
                >
                  <a-select v-model:value="roleFormState.status" allow-clear placeholder="请选择">
                    <a-select-option :value="0">
                      是
                    </a-select-option>
                    <a-select-option :value="1">
                      否
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item class="mb-0" label="备注" name="remark">
                  <a-textarea
                    v-model:value="roleFormState.remark"
                    show-count
                    :maxlength="100"
                    :auto-size="{ minRows: 4, maxRows: 5 }"
                  />
                </a-form-item>
              </a-form>
            </div>
          </a-tab-pane>
          <a-tab-pane key="permissionAssign" tab="权限分配" force-render>
            <div class="h-50vh overflow-y-auto py-2">
              <a-table
                class="bg-[#ffffff] rounded-[5px]"
                :columns="columns"
                :data-source="dataSource"
                bordered
                center
                :pagination="false"
              >
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'firstMenu'">
                    <div class="flex justify-start items-center px-2">
                      <a-checkbox
                        :checked="record.firstMenu.value"
                        @change="handleChangeFirstMenu(record as FormatPermissionList, index)"
                      >
                        {{ record.firstMenu.name }}
                      </a-checkbox>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'secondMenu'">
                    <div class="flex justify-start items-center px-2">
                      <a-checkbox
                        v-if="record.secondMenu.name"
                        :checked="record.secondMenu.value"
                        @change="handleChangeSecondMenu(record as FormatPermissionList)"
                      >
                        {{ record.secondMenu.name }}
                      </a-checkbox>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'actions'">
                    <a-row :gutter="20" class="px-2">
                      <a-col v-for="(item, recordIndex) in record.actions" :key="recordIndex">
                        <a-checkbox
                          :checked="isViewActionSelected(record as FormatPermissionList, item)"
                          :disabled="item.name === FEATURES_PERMISSIONS_TYPE.view"
                          @change="handleChangeActions(record as FormatPermissionList, item)"
                        >
                          {{ item.name }}
                        </a-checkbox>
                      </a-col>
                    </a-row>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button @click="resetFormData">
          取消
        </a-button>
        <a-button type="primary" :loading="saveLoading" @click="handleSubmitClick">
          确定
        </a-button>
      </a-space>
    </template>
  </Dialog>
</template>
