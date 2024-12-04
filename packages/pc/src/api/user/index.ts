import Api from '../axios'

// 二次密钥解密
export async function decrypt(decrypt: any) {
  const res = await Api({
    baseURL: '',
    url: `${import.meta.env.VITE_BASE_API}/papi/common/second-password/v1/decrypt`,
    method: 'POST',
    data: decrypt,
  })
  return res.data
}

// 验证二次密钥
export async function keyPassword(secondPassword: string) {
  const res = await Api({
    baseURL: '',
    url: `${import.meta.env.VITE_BASE_API}/papi/common/second-password/v1/valid-password`,
    method: 'POST',
    data: { secondPassword },
  })
  return res
}
