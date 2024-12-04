<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

import { addMenu, updateMenu } from '@/api/system/menuManage'
import Form from '@/components/Form/index.vue'
import type { IMenuTreeRecord } from '@/interface/system/menuManage'

import { formColumns, formConfig } from './config/editFormConfig'

const emit = defineEmits(['refresh'])
const [dialogVis, dialogVisChange] = useToggle(false)
const [isEditVis, isEditVisChange] = useToggle(false)
const data = ref({} as IMenuTreeRecord)
const baseFormRef = ref<InstanceType<typeof Form> | null>()

function showModal(isEdit: boolean, row?: IMenuTreeRecord) {
  isEditVisChange(isEdit)
  const parentIndex = formColumns.value.findIndex(item => item.field === 'parentId')

  if (isEdit) {
    Object.assign(data.value, row)
  }
  else {
    if (row) {
      data.value.parentId = row.id
      data.value.id = null
    }
    else {
      formColumns.value[parentIndex].treeData = [{ name: '主目录', id: null, parentId: null }]
      data.value.parentId = null
      data.value.id = null
    }
  }
  dialogVisChange(true)
}

function cancelEvent() {
  data.value = {} as IMenuTreeRecord
  dialogVisChange(false)
}

async function submit() {
  const [result] = await to(baseFormRef.value!.formValidFn()!)

  if (result) {
    const { code, name, path, id, parentId, permissionType } = data.value
    const params = Object.assign({}, { code, name, path, id, parentId, permissionType })

    if (isEditVis.value) {
      const [, error] = await to(updateMenu(params))

      if (error) {
        message.error(error.message)
        return
      }
    }
    else {
      const [, error] = await to(addMenu(params))

      if (error) {
        message.error(error.message)
        return
      }
    }
    emit('refresh')
    cancelEvent()
  }
}

defineExpose({
  showModal,
})
</script>

<template>
  <Dialog
    v-model="dialogVis"
    :title="`${isEditVis ? '编辑' : '新增'}`"
    :config="{ width: '60%' }"
    @cancel="cancelEvent"
  >
    <Form ref="baseFormRef" v-model:data="data" :columns="formColumns" :config="formConfig" />
    <template #footer>
      <a-button @click="cancelEvent">
        取消
      </a-button>
      <a-button type="primary" @click="submit">
        确认
      </a-button>
    </template>
  </Dialog>
</template>
