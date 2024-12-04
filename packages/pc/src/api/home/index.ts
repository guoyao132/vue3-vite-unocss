import { testApi } from '../axios'

// 测试接口
export async function testApiDemo (data:{id:string}) {
  const res = await testApi.post<{id:string}>('/capital/id',data)
  return res.data
}