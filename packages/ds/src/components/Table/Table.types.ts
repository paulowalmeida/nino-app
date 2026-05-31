import {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react'

export type TableProps = HTMLAttributes<HTMLTableElement>
export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement>
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>
