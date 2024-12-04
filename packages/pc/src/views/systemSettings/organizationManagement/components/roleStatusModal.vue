<script setup lang="ts">
import debounce from 'lodash/debounce'
import { computed, ref } from 'vue'

const props = defineProps({
  statusVisible: {
    type: Boolean,
    default: false,
  },
  isBatch: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '开启',
  },
})
const emits = defineEmits(['statusCancelEmit', 'statusConfirmEmit'])
const tipText = computed(() => {
  return props.isBatch ? '这些' : '此'
})
const isEditShow = ref(false)
const formState = ref({
  lockDuration: 365,
  lockType: 0,
  validityPeriodType: 0,
  validDuration: 90,
})

function handleCancel() {
  emits('statusCancelEmit')
}

function handleConfirm() {
  emits('statusConfirmEmit', formState.value)
}
const debounceConfirm = debounce(handleConfirm, 500, { leading: true, trailing: false })

// 表单重置
function resetForm() {
  formState.value = {
    lockDuration: 365,
    lockType: 0,
    validityPeriodType: 0,
    validDuration: 90,
  }
}
defineExpose({
  resetForm,
})
</script>

<template>
  <div class="organization">
    <a-modal
      :open="statusVisible"
      :title="title"
      :mask-closable="false"
      width="30%"
      @cancel="handleCancel"
    >
      <!-- <a-form ref="formRef" :model="formState">
        <a-form-item
          :label="title === '开启' ? '账号类型：' : '锁定时长：'"
          name="status"
          :rules="[{ required: true, message: '请选择', trigger: 'blur' }]"
        >
          <div v-if="title === '开启'" class="flex mt-5px justify-center">
            <a-radio-group v-model:value="formState.status" class="w-full">
              <a-radio :value="0" :disabled="isEditShow">永久账号</a-radio>
              <br />
              <a-radio :value="1" :disabled="isEditShow">
                <span>临时账号</span>
                <div v-if="formState.status === 1" class="ml-8 inline-block">
                  有效时长（天）：
                  <a-input-number
                    id="inputNumber"
                    v-model:value="formState.validDuration"
                    :min="1"
                    :max="90"
                  />
                </div>
              </a-radio>
            </a-radio-group>
          </div>
          <div v-else class="flex mt-5px justify-center">
            <a-radio-group v-model:value="formState.status" class="w-full">
              <a-radio :value="0" :disabled="isEditShow">永久</a-radio>
              <br />
              <a-radio :value="1" :disabled="isEditShow">
                <span>自定义</span>
                <div v-if="formState.status === 1" class="ml-8 inline-block">
                  <a-input-number
                    id="inputNumber"
                    v-model:value="formState.validDuration"
                    :min="1"
                    :max="365"
                  />
                  （天）
                </div>
              </a-radio>
            </a-radio-group>
          </div>
        </a-form-item>
      </a-form> -->
      <div v-if="title === '开启'">
        <p>确定要启用{{ tipText }}账号吗？启用{{ tipText }}账号需设置有效期</p>
        <div class="flex mt-10px justify-center">
          <p class="w-25">
            账号类型：
          </p>
          <a-radio-group v-model:value="formState.validityPeriodType" class="w-full">
            <a-radio :value="0" :disabled="isEditShow">
              永久账号
            </a-radio>
            <br>
            <a-radio :value="1" :disabled="isEditShow">
              <span>临时账号</span>
              <div v-if="formState.validityPeriodType === 1" class="ml-8 inline-block">
                有效时长（天）：
                <a-input-number
                  id="inputNumber"
                  v-model:value="formState.validDuration"
                  :min="1"
                  :max="90"
                />
              </div>
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div v-else>
        <p>你确定需要锁定{{ tipText }}账户吗？</p>
        <div class="flex mt-10px justify-center">
          <p class="w-25">
            锁定时长：
          </p>
          <a-radio-group v-model:value="formState.lockType" class="w-full">
            <a-radio :value="0" :disabled="isEditShow">
              永久
            </a-radio>
            <br>
            <a-radio :value="1" :disabled="isEditShow">
              <span>自定义</span>
              <div v-if="formState.lockType === 1" class="ml-8 inline-block">
                <a-input-number
                  id="inputNumber"
                  v-model:value="formState.lockDuration"
                  :min="1"
                  :max="365"
                />
                （天）
              </div>
            </a-radio>
          </a-radio-group>
        </div>
      </div>

      <template #footer>
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" ghost :loading="loading" @click="debounceConfirm">
          确定
        </a-button>
      </template>
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
