import JSEncrypt from 'jsencrypt'
import { sm2, sm4 } from 'sm-crypto'

const key = '6a0150d920172857599c94bdd0a233a6'
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGViLzhKeaQytzwnDIh5o5+trVUV/+nHZP4hfJeq217tOeW2nQylW8F4MFtI7d6fQQ63ZuBGv1+BMKGmKogqXhj9NYNZNwZreMXIZ85C1wnpm4nM81SkiI8Nv6LUIaVuQC3H+3/Yb4cXXunoEmIDaQuYU2zdXJwhIpIMdIvwRknQIDAQAB'

export function sm4Encrypt(data: any) {
  const result = sm4.encrypt(data, key)
  return result
}

// 解密方法
export function sm4Decrypt(data: any) {
  if (!data.length) {
    return ''
  }
  else {
    const result = sm4.decrypt(data, key)
    return result.replace(/\s/g, '')
  }
}

const sm2PrivateKey = '48dbd74d5e047022e761167144b75082a20ea69c611812a74b335be6efcb1df8'

export function sm2Encrypt(data: any) {
  const signature = sm2.doSignature(JSON.stringify(data), sm2PrivateKey, { hash: true, der: true })
  return signature
}

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) as string // 对数据进行加密
}
