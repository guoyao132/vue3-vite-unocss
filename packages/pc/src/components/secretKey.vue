<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import { ref, watch } from 'vue'

import { decrypt, keyPassword } from '@/api/user'
import { useSecretKeyStore } from '@/stores/secretKey'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '查看',
  },
  secretKeyType: {
    type: String,
    default: '',
  },
  secretKeyPhone: {
    type: String,
    default: '',
  },
  secretKeyIdCard: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['cancel', 'confirm'])

const { SecretKey, changeSecretKeyStore } = useSecretKeyStore()
const [submitLoading, submitLoadingToggle] = useToggle()
const [visible, visibleToggle] = useToggle()
const keyword = ref('')

watch(
  () => props.visible,
  (visible) => {
    if (props.secretKeyPhone || props.secretKeyIdCard) {
      visibleToggle(visible)
      return
    }

    if (visible && SecretKey[props.secretKeyType]) {
      changeSecretKeyStore(props.secretKeyType, false)
      handleCancel()
    }
    else {
      visibleToggle(visible)
    }
  },
)

function handleCancel() {
  keyword.value = ''
  submitLoadingToggle(false)
  emits('cancel')
}

async function handleConfirm() {
  if (!keyword.value) {
    message.warning('请输入密钥')
    return
  }
  submitLoadingToggle(true)

  if (props.secretKeyIdCard) {
    const params = {
      infoMap: {
        phone: '',
        idCard: props.secretKeyIdCard,
      },
      secondPassword: keyword.value,
    }
    const [data, err] = await to(decrypt(params))

    if (!err) {
      emits('confirm', data)
      handleCancel()
    }
    else {
      message.error(err.message ?? '验证失败，请重试')
    }
  }
  else {
    const [, err] = await to(keyPassword(keyword.value))

    if (!err) {
      changeSecretKeyStore(props.secretKeyType, true)
      handleCancel()
    }
    else {
      message.error(err.message ?? '验证失败，请重试')
    }
  }
  submitLoadingToggle(false)
}

defineExpose({
  visibleToggle,
})
</script>

<template>
  <div>
    <a-modal
      :z-index="1001"
      :open="visible"
      :title="title"
      :mask-closable="false"
      width="30%"
      @cancel="handleCancel"
    >
      <template #default>
        <a-form-item label="密钥">
          <a-input v-model:value="keyword" placeholder="请输入" />
        </a-form-item>
      </template>
      <template #footer>
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button
          type="primary"
          ghost
          :disabled="!keyword"
          :loading="submitLoading"
          @click="handleConfirm"
        >
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
