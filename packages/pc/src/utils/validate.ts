import type { Rule } from 'ant-design-vue/es/form'

enum ERR_MESSAGE {
  NO_PHONE = '请输入手机号',
  WRONG_PHONE = '请输入正确手机号',
  NO_IGW = '请输入i国网账号',
  WRONG_IGW = '请输入正确i国网账号',
  WRONG_ID_CARD = '请输入正确身份证号',
  WRONG_PLATE_NUMBER = '请输入正确车牌号',
}
// i国网账号
// const regIgw = /^[A-Za-z0-9]+$/
// 手机号
const regMobile
  = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/

// 自定义校验igw账号
export function validateIgw(_rule: Rule, value: string) {
  if (!value)
    return Promise.reject(new Error(ERR_MESSAGE.NO_IGW))
  else return Promise.resolve()
}

// 自定义校验手机号必填
export function validatePhone(_rule: Rule, value: string) {
  if (!value)
    return Promise.reject(new Error(ERR_MESSAGE.NO_PHONE))
  else if (!regMobile.test(value))
    return Promise.reject(new Error(ERR_MESSAGE.WRONG_PHONE))
  else return Promise.resolve()
}
