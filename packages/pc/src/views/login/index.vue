<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useToggle } from '@vueuse/core'
import { to } from '@web/common/util'
import { message } from 'ant-design-vue'
import JSEncrypt from 'jsencrypt'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { login } from '@/api/login'
import CopyRight from '@/components/CopyRight/index.vue'
import type { LoginParam } from '@/interface/login'
import { encrypt } from '@/utils/gmCrypto'

const formState = reactive<LoginParam>({
  account: '',
  password: '',
  loginType: 1,
})
const [submit, submitToggle] = useToggle(false)

function onFinish() {
  if (submit.value)
    return
  loginIn()
}

const router = useRouter()

async function loginIn() {
  submitToggle(true)
  formState.password = encrypt(formState.password as string)
  const [data, err] = await to(login(formState))

  if (!err) {
    sessionStorage.setItem('SPIDER-TOKEN', data.token)
    submitToggle(false)
    router.replace('/')
  }
  else {
    message.error(err.message)
    submitToggle(false)
  }
}
</script>

<template>
  <a-row class="min-h-screen">
    <a-col :span="12" class="flex flex-col space-y-4 bg-[#00706b] justify-center items-center">
      <span class="font-bold text-40px text-light-100"> 开箱即用的高质量模板 </span>
      <span class="text-24px text-light-100"> 丰富的的页面模板，覆盖大多数典型业务场景 </span>
    </a-col>
    <a-col :span="12" class="bg-[#ffffff] flex flex-col w-full justify-center items-center">
      <h2 class="font-bold mb-30px text-3xl text-gray-800">
        欢迎登录 数字基建平台
      </h2>
      <div class="flex flex-col w-full justify-center items-center">
        <a-form class="w-1/2" :model="formState" name="basic" autocomplete="off" @finish="onFinish">
          <a-form-item name="account" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input
              v-model:value="formState.account"
              size="large"
              allow-clear
              placeholder="请输入账号"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password
              v-model:value="formState.password"
              size="large"
              allow-clear
              placeholder="请输入密码"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button
              size="large"
              class="w-full"
              shape="round"
              type="primary"
              :loading="submit"
              html-type="submit"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="fixed bottom-8">
        <CopyRight />
      </div>
    </a-col>
  </a-row>
</template>
