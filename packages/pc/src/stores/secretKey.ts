import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

interface SecretKey {
  [key: string]: boolean
  meetingIdCardKey: boolean
  meetingPhoneKey: boolean
  meetingSignKey: boolean
  meetingMemberEdit: boolean
  trainingIdCardKey: boolean
  trainingPhoneKey: boolean
  trainingStudentEdit: boolean
  organizationKey: boolean
  organizationEdit: boolean
  isCollapsed: boolean
}

const defaultSecret: SecretKey = {
  isCollapsed: false,
  meetingIdCardKey: false,
  meetingPhoneKey: false,
  meetingSignKey: false,
  meetingMemberEdit: false,
  trainingIdCardKey: false,
  trainingPhoneKey: false,
  trainingSignKey: false,
  trainingStudentEdit: false,
  organizationKey: false,
  organizationEdit: false,
}
const SecretKeyStorage = useStorage('secretKey', defaultSecret, sessionStorage)

export const useSecretKeyStore = defineStore('secretKey', {
  state: () => ({
    SecretKey: SecretKeyStorage.value,
  }),
  actions: {
    changeSecretKeyStore(key: string, value: boolean) {
      this.SecretKey[key] = value
      SecretKeyStorage.value[key] = value
    },
  },
})
