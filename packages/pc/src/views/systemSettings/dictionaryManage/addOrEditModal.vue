<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import { ref } from 'vue'

import { updateDictionary, updateDictionaryDetail } from '@/api/system/dictionary'
import Form from '@/components/Form/index.vue'
import type { FormColumnType, FormConfigType } from '@/interface/form'
import type { IDictionaryAddOrEditParams } from '@/interface/system/dictionary'

import {
  dictionaryValueFormColumns,
  dictionaryValueFormConfig,
  formColumns,
  formConfig,
} from './config/addOrEditFormConfig'

const emit = defineEmits(['refresh'])
const [dialogVis, dialogVisChange] = useToggle(false)
const [isEditVis, isEditVisChange] = useToggle(false)
const [inDictionaryValueList, inDictionaryValueListChange] = useToggle(false)
const data = ref({} as IDictionaryAddOrEditParams)
const baseFormRef = ref<InstanceType<typeof Form> | null>()
const config = ref({} as FormConfigType)
const columns = ref<FormColumnType[]>([])

function showModal(isEdit: boolean, isDictionaryValue: boolean, row?: IDictionaryAddOrEditParams) {
  isEditVisChange(isEdit)
  inDictionaryValueListChange(isDictionaryValue)
  columns.value = isDictionaryValue ? dictionaryValueFormColumns.value : formColumns.value
  config.value = isDictionaryValue ? dictionaryValueFormConfig : formConfig

  if (isDictionaryValue)
    data.value.dictId = row?.dictId

  if (isEdit && row)
    Object.assign(data.value, row)

  dialogVisChange(true)
}

function cancelEvent() {
  data.value = {} as IDictionaryAddOrEditParams
  dialogVisChange(false)
}

async function submit() {
  const [result] = await to(baseFormRef.value!.formValidFn()!)

  if (result) {
    if (inDictionaryValueList.value) {
      const [, error] = await to(updateDictionaryDetail(data.value))

      if (error) {
        message.error(error.message)
        return
      }
    }
    else {
      const [, error] = await to(updateDictionary(data.value))

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
    <Form ref="baseFormRef" v-model:data="data" :columns="columns" :config="config" />
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
