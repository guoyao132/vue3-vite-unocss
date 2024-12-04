import type { IPaginationType } from '../index'

export interface SiftLogsRecord {
  account?: string
  content?: string
  executeEndTime?: number | null
  executeStartTime?: number | null
  operationName?: string
  result?: number | null
  eventCategory?: string | null
  eventType?: string | null
  sort?: string
  time?: string[]
}

export type LogsListParam = IPaginationType & SiftLogsRecord

export interface ExportOrDeleteParam {
  ids: string[]
}

export interface LogsRecord {
  account: string
  content: string
  createTime: string
  duration: number
  id: string
  ip: string
  operationName: string
  result: number
  interfacePath: string
  requestJson: string
  abnormalEventDescribe: string
  allowDeletionStatus: boolean
  eventCategory: string
  eventType: string
}

export interface LogsListRecord {
  hasNextPage: boolean
  list: LogsRecord[]
  total: number
}

export interface AlarmLogsResponse {
  alarm: string
  status: boolean
}

export interface StatisticsResponse {
  operationName: string
  account: string
  successfulLoginNum: string
  failedLoginNum: string
}

export interface StatisticsParam {
  executeStartTime: number | null
  executeEndTime: number | null
}
