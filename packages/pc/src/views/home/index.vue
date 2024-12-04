<script setup lang="ts">
import { to } from '@web/common/util'
import {  message } from 'ant-design-vue'
import { onMounted } from 'vue'
import { testApiDemo } from '@/api/home'

onMounted(async () => {
  const [data, err] = await to(testApiDemo({id:'1614107817810202625'}))
  if (!err) {
    console.log(data)
  }
  else {
    message.error(err.message)
  }
})


</script>

<template>
  <Page>
    <div class="flex justify-center items-center h-[calc(100vh-200px)]">
      <span>欢迎使用数字基建平台</span>
    </div>
  </Page>
</template>

<style lang="less" scoped></style>
