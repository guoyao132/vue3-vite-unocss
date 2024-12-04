import type {
  IDictionaryAddOrEditParams,
  IDictionaryListParams,
  IDictionaryListResponse,
} from '@/interface/system/dictionary'

import Api from '../axios'

//  字典列表
export async function getDictionaryList(data: IDictionaryListParams) {
  const res = await Api.post<IDictionaryListResponse>('/dict/v1/type/list', data)
  return res.data
}

//  字典数据列表
export async function getDictionaryDetailList(data: IDictionaryListParams) {
  const res = await Api.post<IDictionaryListResponse>('/dict/v1/data/list', data)
  return res.data
}

//  字典新增/编辑
export async function updateDictionary(data: IDictionaryAddOrEditParams) {
  const res = await Api.post<string>('/dict/v1/type/save', data)
  return res.data
}

//  字典数据新增/编辑
export async function updateDictionaryDetail(data: IDictionaryAddOrEditParams) {
  const res = await Api.post<string>('/dict/v1/data/save', data)
  return res.data
}

//  字典删除
export async function deleteDictionary(dictId: string) {
  const res = await Api.post<string>(`/dict/v1/type/del/${dictId}`)
  return res.data
}

//  字典数据删除
export async function deleteDictionaryDetail(dictId: string) {
  const res = await Api.post<string>(`/dict/v1/data/del/${dictId}`)
  return res.data
}
