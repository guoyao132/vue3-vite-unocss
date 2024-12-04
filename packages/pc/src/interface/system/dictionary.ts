import type { IPaginationType, ResponseListType } from '@/interface'

export interface ISiftDictionaryRecord {
  dictName?: string
  status?: string
  dictType?: string
  dictId?: string
  dictLabel?: string
}

export interface IDictionaryListParams extends IPaginationType, ISiftDictionaryRecord {}

export interface IDictionaryListRecord {
  createTime: string
  dictName: string
  dictType: string
  remark: string
  status: string
  dictLabel: string
}

export interface IDictionaryListResponse extends ResponseListType<IDictionaryListRecord> {}

export interface IDictionaryAddOrEditParams {
  dictName?: string
  dictType?: string
  id?: string
  remark?: string
  status?: string
  dictLabel?: string
  dictId?: string
  dictValue?: string
}
