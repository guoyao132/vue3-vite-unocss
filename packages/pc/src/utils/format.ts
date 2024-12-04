import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

/**
 *
 * @param utcString utc字符串
 * @param format 格式化展示形式
 * @returns 格式化后的时间字符串
 */
export function formatUTC(utcString: string, format = 'YYYY-MM-DD HH:mm:ss') {
  const res = dayjs.utc(utcString).utcOffset(8).format(format)
  return res
}

/**
 *
 * @param timeString 时间戳字符串
 * @param format 格式化展示形式
 * @returns 格式化后的时间字符串
 */
export function formatTime(timeString: string | number, format = 'YYYY-MM-DD HH:mm:ss') {
  let res: number | string = ''
  if (timeString)
    res = dayjs(timeString).format(format)
  else res = ''

  return res
}

// 清空cookie
export function clearCookie() {
  const keys = document.cookie.match(/[^ =;]+(?==)/g)

  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}` // 清除当前域名下的,例如：m.kevis.com
      document.cookie = `${keys[i]}=0;path=/;domain=${document.domain};expires=${new Date(
        0,
      ).toUTCString()}` // 清除当前域名下的，例如 .m.kevis.com
      document.cookie = `${keys[i]}=0;path=/;domain=kevis.com;expires=${new Date(0).toUTCString()}` // 清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}

export function formatExecuteTime(milliseconds: number) {
  switch (true) {
    case milliseconds >= 3600000:
      return `${(milliseconds / 3600000).toFixed(1)}小时`
    case milliseconds >= 60000:
      return `${(milliseconds / 60000).toFixed(1)}分钟`
    case milliseconds >= 1000:
      return `${(milliseconds / 1000).toFixed(1)}秒`
    default:
      return `${milliseconds}毫秒`
  }
}

// js将数字转换成万 并且保留两位小数
export const numAddUnit = (num: number) => {
  let s_x = ''

  if (num > 10000) {
    let result = num / 10000
    result = Math.floor(result * 100) / 100
    s_x = result.toString() // 将数字转换为字符串
    let pos_decimal = s_x.indexOf('.') // 小数点的索引值

    // 当整数时，pos_decimal=-1 自动补0
    if (pos_decimal < 0) {
      pos_decimal = s_x.length
      s_x += '.'
    }
    // 当数字的长度< 小数点索引+2时，补0
    while (s_x.length <= pos_decimal + 2)
      s_x += '0'

    s_x += '万'
  }
  else {
    s_x = String(num)
  }
  return s_x
}

export function phoneFormat(visible: boolean, phone?: string) {
  let decryptPhone = phone
  if (phone && phone.length > 11)
    decryptPhone = String(phone)

  if (visible)
    return decryptPhone?.length ? decryptPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
  else
    return decryptPhone
}
