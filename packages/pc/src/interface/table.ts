import type { TableProps } from 'ant-design-vue/es/table/Table'
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableRowSelection,
} from 'ant-design-vue/es/table/interface'

import type { TableColumnTypeEnum } from '@/enums'

export interface TableConfigType extends Omit<TableProps, 'rowSelection'> {
  columns?: ColumnsType
  rowKey?: string
  bordered?: boolean
  loading?: boolean
  pagination?: TablePaginationConfig
  scroll?: {
    scrollToFirstRowOnChange?: boolean
    x?: string | number | true
    y?: string | number
  }
  rowSelection?: TableRowSelection<any>
  sticky?:
    | boolean
    | { offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement }
  isChildren?: boolean
}

export interface TableColumnExtendType {
  type?: TableColumnTypeEnum
  valueMap?: Record<string, any>
  typeMap?: Record<string, string>
  separator?: string
  format?: string
  field?: string[]
}

export type TableColumnAllType = ColumnType & TableColumnExtendType
