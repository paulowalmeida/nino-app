import { HTMLAttributes, Ref, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Table.module.css'

type TableProps = HTMLAttributes<HTMLTableElement> & {
  ref?: Ref<HTMLTableElement>
}

type TableSectionProps = HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement>
}

type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  ref?: Ref<HTMLTableRowElement>
}

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement>
}

/**
 * Table pieces to assemble by hand — bring the data (or TanStack Table) and
 * put together `Table` with `TableHeader`, `TableBody`, `TableRow`,
 * `TableHead` and `TableCell`.
 *
 * They live in one file because they only make sense together: a
 * `TableCell` outside a `Table` is not a component, it is a stray `<td>`.
 *
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Item</TableHead>
 *       <TableHead>Preço</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Pão</TableCell>
 *       <TableCell>R$ 5</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({ className, ref, ...props }: TableProps) {
  return (
    <div className={styles.scroller}>
      <table
        ref={ref}
        className={mergeClasses(styles.table, className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ref, ...props }: TableSectionProps) {
  return (
    <thead
      ref={ref}
      className={mergeClasses(styles.header, className)}
      {...props}
    />
  )
}

export function TableBody({ className, ref, ...props }: TableSectionProps) {
  return (
    <tbody
      ref={ref}
      className={mergeClasses(styles.body, className)}
      {...props}
    />
  )
}

export function TableRow({ className, ref, ...props }: TableRowProps) {
  return (
    <tr ref={ref} className={mergeClasses(styles.row, className)} {...props} />
  )
}

export function TableHead({ className, ref, ...props }: TableHeadProps) {
  return (
    <th ref={ref} className={mergeClasses(styles.headerCell, className)} {...props} />
  )
}

export function TableCell({ className, ref, ...props }: TableCellProps) {
  return (
    <td ref={ref} className={mergeClasses(styles.bodyCell, className)} {...props} />
  )
}
