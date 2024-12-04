/*
* 数字基建平台通用配置项
*/

import { throttle } from 'lodash'

/*
* 加载loading延迟时间--300ms
*/
export const loginOutUrl = 'http://portalnew.cq.sgcc.com.cn/up/pweb/desktop/pweb/login/logout'

export const customDelay = 500

/*
* 表格序号样式
*/
export const customTableIndexStyle = {
  width: 50,
  align: 'center',
}

/*
* 表格分页样式
*/
export const customPaginationOptions = {
  showTotal: (total: number) => `共 ${total} 条`,
  defaultPageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
}

/*
* 表格除去title和分页以及padding的高度
*/
export const titleAndPaginationHeight = {
  common: 96,
  meetingAndTrain: 126,
  logsAndRole: 106,
}

/*
* 节流通用配置
*/
export const commonThrottleConfig = {
  time: 500,
  config: { leading: true, trailing: true },
}

/**
 * 通用节流函数
 * @param fn 需要节流函数，类型为any
 * @param time 节流时间
 */
export const commonThrottle = (fn: any, time?: number, leading: boolean = true, trailing: boolean = true) => {
  return throttle(
    fn,
    time ?? commonThrottleConfig.time,
    { ...commonThrottleConfig.config, leading, trailing },
  )
}
