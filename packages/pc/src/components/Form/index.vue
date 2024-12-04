<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'

import { FormColumnTypeEnum } from '@/enums'
import type { FormColumnType, FormConfigType } from '@/interface/form'

import {
  datePickerDefaultConfig,
  dateRangeDefaultConfig,
  formDefaultConfig,
  selectDefaultConfig,
} from './formDefaultConfig'

const props = withDefaults(
  defineProps<{
    config: FormConfigType
    columns: FormColumnType[]
    data: any // 根据传值决定
  }>(),
  {
    config: () => formDefaultConfig,
    data: () => [],
  },
)
const emit = defineEmits(['update:data', 'change'])
const formIns = ref<FormInstance>()
const config = computed(() => Object.assign({}, formDefaultConfig, props.config))
const columns = ref(props.columns)
const data = ref(props.data)
const defaultValue = ref<string[]>([])

watch(
  () => props.data,
  () => {
    data.value = props.data
  },
  { deep: true },
)

watch(
  () => props.columns,
  () => {
    columns.value = props.columns
  },
  { deep: true },
)

function changeValueEvent(key?: string) {
  emit('update:data', data.value)
  emit('change', key)
}

function formValidFn() {
  return formIns.value?.validate()
}

function clearValidFn() {
  return formIns.value?.clearValidate()
}

const cascaderFieldNames = {
  children: 'items',
  label: 'name',
  value: 'id',
}

const selectFieldNames = {
  options: 'options',
  label: 'label',
  value: 'value',
}

const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().includes(input.toLowerCase())
}

const pickerChange = (item: FormColumnType) => {
  if (item.beginWidth && data.value[item.field]) {
    const start = String(dayjs(+data.value[item.field]).startOf('day').valueOf())
    const end = String(dayjs(+data.value[item.field]).endOf('day').valueOf())
    data.value[item.field] = item.beginWidth === 'start' ? start : end
    changeValueEvent()
  }
  else {
    changeValueEvent()
  }
}

const pickerRangeChange = (item: FormColumnType) => {
  if (data.value[item.field]) {
    const start = String(dayjs(+data.value[item.field][0]).startOf('day').valueOf())
    const end = String(dayjs(+data.value[item.field][1]).endOf('day').valueOf())
    data.value[item.field][0] = start
    data.value[item.field][1] = end
    changeValueEvent()
  }
}

defineExpose({
  formValidFn,
  clearValidFn,
})
</script>

<template>
  <a-form ref="formIns" v-bind="config" :model="data">
    <a-row v-bind="config.row" class="items-start">
      <template v-for="(item, index) in columns">
        <a-col
          v-if="!item?.hidden"
          v-bind="item.span ? item.span : Object.assign({}, config.col, item?.col)"
          :key="index"
        >
          <a-form-item
            :label="item.label"
            :name="item.name ?? item.field"
            :rules="item.rules ?? []"
            :class="{
              hasNotValidatorClass: !config.hasValidator,
              isEmbeddedClass: config.isEmbedded,
            }"
          >
            <span v-if="config.isEmbedded">{{ item.label }}：</span>
            <a-input
              v-if="item.type === FormColumnTypeEnum.INPUT"
              v-model:value="data[item.field]"
              allow-clear
              v-bind="{ item }"
              :readonly="item.readonly"
              @change="changeValueEvent(item.field)"
            />

            <a-input
              v-if="item.type === FormColumnTypeEnum.NUMBER"
              v-model:value="data[item.field]"
              allow-clear
              v-bind="{ item }"
              type="number"
              @change="changeValueEvent(item.field)"
            />

            <a-select
              v-if="item.type === FormColumnTypeEnum.SELECT"
              v-model:value="data[item.field]"
              :options="item.options"
              option-filter-prop="label"
              v-bind="Object.assign({}, selectDefaultConfig, item)"
              @change="changeValueEvent(item.field)"
            />

            <a-select
              v-if="item.type === FormColumnTypeEnum.SEARCH_SELECT"
              v-model:value="data[item.field]"
              :options="item.options"
              option-filter-prop="label"
              :field-names="item.fieldNames ? item.fieldNames : selectFieldNames"
              v-bind="Object.assign({}, selectDefaultConfig, item)"
              :filter-option="filterOption"
              @change="changeValueEvent(item.field)"
            />
            <a-tree-select
              v-if="item.type === FormColumnTypeEnum.TREE_SELECT"
              v-model:value="data[item.field]"
              v-bind="item"
              :tree-data="item.treeData"
            />
            <a-switch
              v-if="item.type === FormColumnTypeEnum.SWITCH"
              v-model:checked="data[item.field]"
              @change="changeValueEvent(item.field)"
            />

            <a-textarea
              v-if="item.type === FormColumnTypeEnum.TEXTAREA"
              v-model:value="data[item.field]"
              :rows="4"
              :maxlength="item.max ? item.max : 1000"
              show-count
              v-bind="{ item }"
              oninput="value=value.replace(/[, ]/g,'')"
              onkeyup="value=value.replace(/[, ]/g,'')"
              @change="changeValueEvent(item.field)"
            />

            <a-cascader
              v-if="item.type === FormColumnTypeEnum.CASCADER"
              v-model:value="data[item.field]"
              :options="item.options"
              :field-names="cascaderFieldNames"
              :default-value="defaultValue"
              change-on-select
              @change="changeValueEvent(item.field)"
            />

            <a-range-picker
              v-if="item.type === FormColumnTypeEnum.DATE_RANGE"
              v-model:value="data[item.field]"
              v-bind="Object.assign({}, dateRangeDefaultConfig)"
              @change="pickerRangeChange(item)"
            />

            <a-date-picker
              v-if="item.type === FormColumnTypeEnum.DATE"
              v-model:value="data[item.field]"
              v-bind="Object.assign({}, datePickerDefaultConfig, item)"
              @change="pickerChange(item)"
            />
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<style scoped lang="less">
.hasNotValidatorClass {
  margin-bottom: 0;
}

.isEmbeddedClass {
  :deep(.ant-form-item-control-input-content) {
    border-radius: 8px;
    border: 1px solid #dadada;
    padding-left: 15px;
    display: flex;

    span {
      display: flex;
      // justify-content: flex-end;
      align-items: center;
      white-space: nowrap;
    }

    .ant-input-affix-wrapper,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    textarea.ant-input,
    .ant-picker-range,
    .ant-picker {
      border: none;
      padding: 0;

      // > input,
      // > * > input {
      //   text-align: right;
      //   line-height: inherit;
      // }

      .ant-input-suffix {
        padding-right: 10px;
      }
    }

    .ant-picker {
      padding-right: 15px;
    }

    .ant-select-selector {
      box-shadow: none !important;
    }

    .ant-select-selection-item {
      width: 0;
    }

    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      padding-right: 35px;
    }

    .ant-select-selection-search {
      inset-inline-start: 0;
      & > input {
        margin-right: 20px;
      }
    }
  }

  :deep(.ant-form-item-label) {
    display: none;
  }
}

:deep(.ant-space-item) {
  display: flex;
}

:deep(.ant-form-item-control-input-content) {
  display: flex;
  justify-content: left;
  align-items: center;
}

:deep(.ant-input-textarea) {
  width: 100%;
}

:deep(.ant-space) {
  overflow: auto;
}
</style>
