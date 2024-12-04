<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { message } from 'ant-design-vue'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  num: {
    type: Number,
    default: 1,
  },
})

const emits = defineEmits(['submit'])

const [settingVisible, settingToggle] = useToggle()
const settingNum = ref(1)

watch(
  () => props.visible,
  (val) => {
    settingToggle(val)
  },
)
watch(
  () => props.num,
  (val) => {
    settingNum.value = val
  },
)

function handleCancel() {
  settingToggle(false)
  emits('submit', undefined)
}

function handleSubmit() {
  if (settingNum.value < 10000000 && settingNum.value > 0)
    emits('submit', settingNum.value)
  else
    message.warning('请输入1-10000000内整数')
}
</script>

<template>
  <div>
    <a-modal
      v-model:open="settingVisible"
      title="告警设置"
      :mask-closable="false"
      width="500px"
      @cancel="handleCancel"
    >
      <div class="flex items-center">
        <span>日志条数:</span>
        <a-input-number id="inputNumber" v-model:value="settingNum" type="number" :min="1" :max="10000000" class="flex-1 ml-4" placeholder="请输入1-10000000内整数" />
      </div>
      <template #footer>
        <a-button @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" ghost @click="handleSubmit">
          保存
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
