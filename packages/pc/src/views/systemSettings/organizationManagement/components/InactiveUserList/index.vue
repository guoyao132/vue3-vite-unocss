<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { NotRevalidateOption } from '@web/common/swrv'
import useSWRV from 'swrv'
import { watch } from 'vue'

import { inactiveUser } from '@/api/system/organization'

import { tableColumns, tableConfig } from './config/tableConfig'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'export'])

const [dialogVis, dialogVisChange] = useToggle(false)

const { data: dataSource, isValidating: loading } = useSWRV(
  () => 'inactive-user-list',
  () => inactiveUser(),
  NotRevalidateOption,
)

watch(
  () => props.modelValue,
  (val) => {
    dialogVisChange(val)
  },
)

watch(
  () => dataSource.value,
  () => {
    tableConfig.value.pagination!.total = dataSource.value?.length
  },
  {
    deep: true,
    immediate: true,
  },
)

function handleCancel() {
  dialogVisChange(false)
  emit('update:modelValue', false)
}
</script>

<template>
  <Dialog v-model="dialogVis" title="不活跃成员" :config="{ width: '60%' }" @cancel="handleCancel">
    <Table
      :config="tableConfig"
      :data="dataSource ? dataSource : []"
      :columns="tableColumns"
      :loading="loading"
    >
      <template #header>
        <a-button type="primary" @click="emit('export')">
          导出
        </a-button>
      </template>
    </Table>
  </Dialog>
</template>
