import { forwardRef } from 'react'

import { mergeClasses } from '@ds/lib/mergeClasses'

import {
  TableCellProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TableSectionProps,
} from './Table.types'

/**
 * Styled table primitives for composition. Bring your own data
 * (or TanStack Table) and assemble with Table + TableHeader/Body/Row/Head/Cell.
 *
 * White surface; hover and selected row (`data-selected`) use the tenant brand
 * light variant, same as dropdowns. All parts accept `className` overrides.
 *
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow><TableHead>Name</TableHead><TableHead>Price</TableHead></TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow><TableCell>Bread</TableCell><TableCell>$5</TableCell></TableRow>
 *   </TableBody>
 * </Table>
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={mergeClasses(
          'w-full caption-bottom bg-white text-sm',
          className
        )}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={mergeClasses('[&_tr]:border-b [&_tr]:border-line', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={mergeClasses(
        '[&_tr:last-child]:border-0 [&_tr:hover]:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)]',
        className
      )}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={mergeClasses(
        'border-b border-line transition-colors data-selected:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)]',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={mergeClasses(
        'h-10 px-3 text-left align-middle text-xs font-medium text-subtle',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={mergeClasses('px-3 py-2.5 align-middle text-ink', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'
