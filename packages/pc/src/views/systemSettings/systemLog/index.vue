<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useToggle } from '@vueuse/core'
import { NotRevalidateOption } from '@web/common/swrv'
import { to } from '@web/common/util'
import { Modal, message } from 'ant-design-vue'
import type { PaginationConfig } from 'ant-design-vue/es/pagination'
import dayjs from 'dayjs'
import useSWRV from 'swrv'
import { createVNode, onMounted, ref, watch } from 'vue'

import {
  abnormalEvents,
  alarmLogs,
  alarmsNumber,
  deleteLogs,
  exportLogs,
  getSystemLogsList,
  setAlarm,
  statisticsNumber,
} from '@/api/system/systemLogs'
import DeleteModal from '@/components/deleteModal.vue'
import type {
  LogsRecord,
  SiftLogsRecord,
  StatisticsParam,
  StatisticsResponse,
} from '@/interface/system/systemLogs'

import LogsDetailModal from './component/logsDetail.vue'
import statisticsModal from './component/statistics.vue'
import WarningSettingModal from './component/warningSetting.vue'
import { headerColumns, headerConfig } from './config/formConfig'
import { tableColumns, tableConfig } from './config/tableConfig'

const formState = ref<SiftLogsRecord>({})
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const selectList = ref<string[]>([])
const [exportLoading, exportLoadingToggle] = useToggle()
const logDetailData = ref<LogsRecord>({} as LogsRecord)
const [detailVisible, detailToggle] = useToggle()
const [deleteModalVisible, deleteModalVisibleToggle] = useToggle()
const customMessage = ref('您确定需要删除该条数据么？')
const customHint = ref('删除该条数据后将无法恢复，请谨慎操作。')
const deleteId = ref<string[]>([])
const deleteLoading = ref(false)
const [warningSetting, warningSettingToggle] = useToggle()
const alarmsNum = ref(1)
const [statistics, statisticsToggle] = useToggle()
const statisticsparam = ref<StatisticsParam>({
  executeStartTime: null,
  executeEndTime: null,
})
const statisticsData = ref<StatisticsResponse[]>([])
const [statisticsLoading, statisticsLoadingToggle] = useToggle()

const {
  data: dataSource,
  isValidating: loading,
  mutate,
} = useSWRV(
  () => `[getLogsList]${JSON.stringify(queryParams.value)}`,
  () => getSystemLogsList(queryParams.value),
  NotRevalidateOption,
)

watch(
  () => dataSource.value,
  () => {
    tableConfig.value.pagination!.total = dataSource.value?.total
  },
  {
    deep: true,
    immediate: true,
  },
)

function changePaginationEvent(pagination: PaginationConfig) {
  if (pagination) {
    queryParams.value.pageNum = pagination.current!
    queryParams.value.pageSize = pagination.pageSize!
  }
}

const toEdit = async (id: string) => {
  const result = dataSource.value!.list.find(item => item.id === id)

  if (result) {
    logDetailData.value = result
    detailToggle()
  }
}

const closeDetailModal = () => {
  logDetailData.value = {} as LogsRecord
  detailToggle()
}

const cancelInDelModal = () => {
  deleteId.value = []
  selectList.value = []
  deleteModalVisibleToggle()
  deleteLoading.value = false
}

const handleDelete = async (value: string[]) => {
  deleteLoading.value = true
  const param = {
    ids: value,
  }
  const [, err] = await to(deleteLogs(param))

  if (!err) {
    message.success('删除成功')
    if (queryParams.value.pageNum > 1 && dataSource.value!.list.length === 1)
      queryParams.value.pageNum--
    tableConfig.value.pagination!.current = queryParams.value.pageNum
    deleteLoading.value = false
    mutate()
  }
  else {
    message.error(err.message)
    deleteLoading.value = false
  }
  cancelInDelModal()
}

const deleteInList = (value: string[]) => {
  customMessage.value = '您确定需要删除该条数据么？'
  customHint.value = '删除该条数据后将无法恢复，请谨慎操作。'
  deleteModalVisibleToggle()
  deleteId.value = value
}

const batchDelete = () => {
  if (!selectList.value.length) {
    message.warning('请先选择日志数据')
    return
  }
  customMessage.value = '您确定需要删除这些数据么？'
  customHint.value = '删除这些数据后将无法恢复，请谨慎操作。'
  deleteModalVisibleToggle()
}

const confirmInDelModal = () => {
  if (deleteId.value.length)
    handleDelete(deleteId.value)
  else handleDelete(selectList.value)
}

const exportDataList = async (type: 'all' | 'checked') => {
  if (type === 'checked' && !selectList.value.length) {
    message.warning('请先选择日志数据')
    return
  }
  exportLoadingToggle()
  const param = {
    ids: type === 'all' ? [] : selectList.value,
  }
  const [data, err] = await to(exportLogs(param))

  if (!err) {
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = `${type === 'checked' ? '选中日志' : '全部日志'}.xlsx`
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    exportLoadingToggle()
    if (type === 'checked')
      selectList.value = []
  }
  else {
    exportLoadingToggle()
    message.error(err.message)
  }
  selectList.value = []
}

const tapSearchRole = () => {
  if (formState.value?.time && formState.value.time.length) {
    formState.value.executeStartTime = dayjs(+formState.value.time[0]).startOf('day').valueOf()
    formState.value.executeEndTime = dayjs(+formState.value.time[1]).endOf('day').valueOf()
  }
  else {
    formState.value.executeStartTime = undefined
    formState.value.executeEndTime = undefined
  }
  queryParams.value.pageNum = 1
  tableConfig.value.pagination!.current = 1
  queryParams.value = { ...queryParams.value, ...formState.value }
}

const resetForm = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
  }
  formState.value = {}
  tableConfig.value.pagination!.current = queryParams.value.pageNum
  tableConfig.value.pagination!.pageSize = queryParams.value.pageSize
}

const setWarningDays = async (data: number) => {
  if (data) {
    const param = {
      alarmCount: data,
    }
    const [, err] = await to(setAlarm(param))

    if (!err) {
      message.success('设置成功')
      sessionStorage.setItem('overSizeWarning', '')
      warningSettingToggle(false)
    }
    else {
      message.error(err.message)
    }
  }
  else {
    warningSettingToggle(false)
  }
}

const getAlarmNums = async () => {
  const [data, err] = await to(alarmsNumber())
  if (!err)
    alarmsNum.value = data.alarmCount
}

const getStatistics = async () => {
  statisticsLoadingToggle(true)
  const [data, err] = await to(statisticsNumber(statisticsparam.value))

  if (!err) {
    statisticsData.value = data
    statisticsLoadingToggle(false)
  }
  else {
    message.error(err.message)
    statisticsLoadingToggle(false)
  }
}

const search = (val: StatisticsParam) => {
  statisticsparam.value = val
  getStatistics()
}

// const openStatistic = () => {
//   getStatistics()
//   statisticsToggle(true)
// }

const closeStatisticModal = () => {
  statisticsToggle(false)
  statisticsparam.value = {
    executeStartTime: null,
    executeEndTime: null,
  }
}
onMounted(async () => {
  getAlarmNums()
  const overSizeWarning = sessionStorage.getItem('overSizeWarning')

  if (!overSizeWarning) {
    const [data, err] = await to(alarmLogs())

    if (!err) {
      if (data.status) {
        Modal.warning({
          title: () => '警告：',
          icon: () => createVNode(ExclamationCircleOutlined),
          content: () => `当前系统的审计日志已超过${alarmsNum.value}条!`,
        })
        sessionStorage.setItem('overSizeWarning', 'after')
      }
    }
    else {
      message.error(err.message)
    }
  }
})

const getAbnormalEvents = async () => {
  const [data, err] = await to(abnormalEvents())

  if (!err) {
    if (data) {
      Modal.warning({
        title: () => '警告：',
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () => `存在异常事件！${data}`,
      })
    }
  }
  else {
    message.error(err.message)
  }
}
// 异常事件轮询
useSWRV(
  () => '[abnormalEvent]',
  () => getAbnormalEvents(),
  { ...NotRevalidateOption, refreshInterval: 30000 },
)
</script>

<template>
  <Page>
    <div class="h-full flex flex-col">
      <Card class="mb-10px">
        <Search :expand="true" @search="tapSearchRole" @reset="resetForm">
          <Form
            v-model:data="formState"
            :columns="headerColumns"
            :config="headerConfig"
            class="flex-1"
          />
        </Search>
      </Card>
      <Card>
        <Table
          v-model:select-list="selectList"
          :config="tableConfig"
          :data="dataSource ? dataSource.list : []"
          :columns="tableColumns"
          :loading="loading"
          @change="changePaginationEvent"
        >
          <template #header>
            <div class="flex justify-between py-2">
              <div class="font-600">
                日志列表
              </div>
              <a-space>
                <!-- <a-button
                @click="openStatistic()"
              >
                统计
              </a-button> -->
                <a-button @click="warningSettingToggle(true)">
                  告警设置
                </a-button>
                <a-button type="link" danger @click="batchDelete()">
                  批量删除
                </a-button>
                <div>
                  <a-popover placement="bottomRight">
                    <template #content>
                      <p class="cursor-pointer mb-8px hover" @click="exportDataList('checked')">
                        导出选中数据
                      </p>
                      <p class="cursor-pointer hover" @click="exportDataList('all')">
                        导出全部数据
                      </p>
                    </template>
                    <a-button :loading="exportLoading">
                      {{ exportLoading ? '导出中' : '导出' }}
                    </a-button>
                  </a-popover>
                </div>
              </a-space>
            </div>
          </template>
          <template #default="{ row }">
            <a-button class="px-0" type="link" @click="toEdit(row.id)">
              详情
            </a-button>
            <a-divider type="vertical" />
            <a-button class="px-0" type="link" danger @click="deleteInList(row.id)">
              删除
            </a-button>
          </template>
        </Table>
        <LogsDetailModal :data="logDetailData" :visible="detailVisible" @close="closeDetailModal" />
        <DeleteModal
          :visible="deleteModalVisible"
          :message="customMessage"
          :hint="customHint"
          :loading="deleteLoading"
          @confirm="confirmInDelModal"
          @cancel="cancelInDelModal"
        />
        <WarningSettingModal :visible="warningSetting" :num="alarmsNum" @submit="setWarningDays" />
        <statisticsModal
          :visible="statistics"
          :data="statisticsData"
          :loading="statisticsLoading"
          @cancel="closeStatisticModal"
          @search="search"
        />
      </Card>
    </div>
  </Page>
</template>
