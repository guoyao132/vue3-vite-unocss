<script setup lang="ts">
import incompatible from '@/assets/img/errPage/000.png'
import unauthorized from '@/assets/img/errPage/401.png'
import NoPermissions from '@/assets/img/errPage/403.png'
import noFound from '@/assets/img/errPage/404.png'
import serverError from '@/assets/img/errPage/500.png'
import router from '@/router'

const props = defineProps({
  code: {
    type: Number as () => 401 | 403 | 404 | 500 | 502 | 600,
    default: 600,
  },
  unusualMessage: {
    type: String,
    default: '',
  },
})

const ExceptionMap = {
  401: unauthorized,
  403: NoPermissions,
  404: noFound,
  500: serverError,
  502: serverError,
  600: incompatible,
}

const ExceptionMessage = {
  401: '抱歉，未授权或授权已过期',
  403: '抱歉，你没有权限访问',
  404: '抱歉，你访问的页面不存在',
  500: '抱歉，服务器发生错误',
  502: '抱歉，服务器发生错误',
  600: '请稍后再重试，或联系管理员。',
}

function isReload() {
  return [401, 600].includes(props.code)
}

function backHome() {
  const res = isReload()

  if (res) {
    window.location.reload()
  }
  else {
    router.go(-1)
  }
}
</script>

<template>
  <div class="flex h-screen justify-center items-center">
    <div class="flex space-x-20 items-center">
      <img :src="ExceptionMap[props.code]" class="h-60 w-90">
      <div class="flex flex-col space-y-[30px]">
        <span class="font-semibold" :class="[props.code === 600 ? 'text-[30px]' : 'text-[60px]']">
          {{ props.code === 600 ? '系统错误' : props.code }}
        </span>
        <span class="text-[20px]">{{ props.unusualMessage || ExceptionMessage[props.code] }}</span>
        <slot name="default">
          <a-button
            v-if="props.code !== 403"
            class="h-auto rounded-[4px] w-max py-3 px-[25px] text-[18px]"
            type="primary"
            @click="backHome"
          >
            {{ isReload() ? '刷新' : '返回上一页' }}
          </a-button>
        </slot>
      </div>
    </div>
  </div>
</template>
