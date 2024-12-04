import type { AlarmLogsResponse, ExportOrDeleteParam, LogsListParam, LogsListRecord, StatisticsParam, StatisticsResponse } from '@/interface/system/systemLogs'

import Api from '../axios'

// 系统日志-列表
export async function getSystemLogsList(data: LogsListParam) {
  const res = await Api.post<LogsListRecord>('/log/v2/list', data)
  return res.data
}

// 删除日志
export async function deleteLogs(data: ExportOrDeleteParam) {
  const res = await Api.post('/log/v2/batch/delete', data)
  return res.data
}

// 导出日志
export async function exportLogs(data: ExportOrDeleteParam) {
  const res = await Api.post('/log/v2/batch/export', data, { responseType: 'blob' })
  return res.data
}

// 异常查询
export async function abnormalEvents() {
  const res = await Api.get<boolean>('log/v2/abnormal-event/find')
  return res.data
}

// 告警查询
export async function alarmLogs() {
  const res = await Api.get<AlarmLogsResponse>('/log/v2/alarm/find')
  return res.data
}

// 告警设置
export async function setAlarm(data: { alarmCount: number }) {
  const res = await Api.post<boolean>('/log/v2/alarm/setting', data)
  return res.data
}

// 获取告警数量
export async function alarmsNumber() {
  const res = await Api.get<{ alarmCount: number }>('/log/v2/alarm/setting/get')
  return res.data
}

// 获取统计数据
export async function statisticsNumber(data: StatisticsParam) {
  const res = await Api.post<StatisticsResponse[]>('/log/v2/statistics/list', data)
  return res.data
}
