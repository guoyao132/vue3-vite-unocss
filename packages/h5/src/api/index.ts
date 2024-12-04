import Api from './axios'

export async function appLoginApi(data: Record<string, any>): Promise<any> {
  const response = await Api.post<any>('/applogin/v1/login', data)
  return response.data
}
