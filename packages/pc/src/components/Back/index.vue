<script setup lang="ts">
import { LeftOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '返回',
  },
)
const router = useRouter()
</script>

<template>
  <Card class="mb-2">
    <div class="flex items-center text-16px">
      <span class="cursor-pointer" @click="router.go(-1)">
        <LeftOutlined class="mr-2" />{{ props.text }}
      </span>
    </div>
  </Card>
</template>
