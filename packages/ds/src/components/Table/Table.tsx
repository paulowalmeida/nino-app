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
 * The row is the piece, not the grid: no rules between rows, separation comes
 * from alternating surface, and the selected row is a filled plate. Column
 * headers are marked the way a Badge is — small caps, wide tracking — because
 * they label, they do not read as content.
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
    className={mergeClasses('border-b border-line', className)}
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
        'transition-colors even:bg-surface-mute hover:bg-line/25 ' +
          'data-selected:bg-body data-selected:text-cream ' +
          'data-selected:hover:bg-body',
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
        'h-9 px-3 text-left align-middle text-[0.6875rem] font-bold ' +
          'uppercase tracking-[0.06em] text-subtle',
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
      className={mergeClasses('px-3 py-3 align-middle text-ink', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'
