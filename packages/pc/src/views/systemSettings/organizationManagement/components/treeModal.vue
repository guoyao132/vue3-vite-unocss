<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { ref } from 'vue'

import type { ITreeAdd, ITreeEdit, ITreeModalFormState } from '@/interface/system/organization'

// 备注any： 此版本无此功能，此界面暂时未对接接口，暂用any
const addParams = ref<any>()
const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)

const formState = ref<ITreeModalFormState>({
  title: '',
  organization: '',
})

// 表单验证
function onFinish() {
  visible.value = false
}

// 表单重置
function resetForm() {
  formRef.value?.resetFields()
  visible.value = false
}

function showModal(params: ITreeAdd | ITreeEdit) {
  if (params.isEdit) {
    // 编辑
    formState.value = params
  }
  else {
    // 新增
  }
  addParams.value = params
  visible.value = true
}

defineExpose({
  showModal,
})
</script>

<template>
  <!--    :title="addParams.isEdit ? '编辑组织' : '新增组织'" -->
  <div class="organization">
    <a-modal
      v-model:open="visible"
      :footer="null"
      :title="addParams?.isEdit ? '编辑组织' : '新增组织'"
      :mask-closable="false"
      width="30%"
      @cancel="resetForm"
      @ok="onFinish"
    >
      <a-form
        ref="formRef"
        class="form"
        :model="formState"
        name="basic"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
      >
        <a-form-item v-if="!addParams.isTop" label="父级组织" name="organization">
          <a-select v-model:value="formState.organization">
            <a-select-option value="shanghai">
              Zone one
            </a-select-option>
            <a-select-option value="beijing">
              Zone two
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="组织名称"
          name="title"
          :rules="[
            { required: true, message: '请输入组织名称', trigger: 'blur' },
            { min: 1, max: 20, message: '组织名称长度为1~20位', trigger: 'blur' },
          ]"
        >
          <a-input v-model:value="formState.title" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.organization {
  :deep(.ant-modal-header) {
    text-align: center;
  }
}
</style>
