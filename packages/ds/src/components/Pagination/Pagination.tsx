import { Pagination as ArkPagination } from '@ark-ui/react/pagination'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { PaginationProps } from './Pagination.types'

/* Mesmo objeto das abas: trilho rebaixado com uma placa levantada marcando
 * onde a pessoa está na sequência. */
const baseRoot =
  'inline-flex items-center gap-1 rounded-card bg-surface-sunk p-1'

const baseNav =
  'inline-flex h-8 min-w-8 items-center justify-center rounded-[6px] ' +
  'text-muted transition-colors hover:bg-cream-deep hover:text-brand-strong ' +
  'disabled:pointer-events-none disabled:opacity-40'

const baseItem =
  'inline-flex h-8 min-w-8 items-center justify-center rounded-[6px] px-2 ' +
  'text-sm font-semibold text-body transition-colors hover:bg-cream-deep ' +
  'hover:text-brand-strong data-[selected]:bg-white ' +
  'data-[selected]:text-ink data-[selected]:shadow-card'

const baseEllipsis =
  'inline-flex h-8 min-w-8 items-center justify-center text-sm text-faint'

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

/**
 * Pagination for lists and tables. Wraps Ark Pagination.
 * Active page uses the tenant brand color.
 *
 * @param count - Total number of items (not pages)
 *
 * @param pageSize - Items per page. Default: 10
 *
 * @param page - Current page (controlled)
 *
 * @param onPageChange - Fired with the new page number
 */
export function Pagination({
  count,
  pageSize = 10,
  page,
  defaultPage = 1,
  siblingCount = 1,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <ArkPagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      defaultPage={defaultPage}
      siblingCount={siblingCount}
      onPageChange={({ page: p }) => onPageChange?.(p)}
      className={mergeClasses(baseRoot, className)}
    >
      <ArkPagination.PrevTrigger className={baseNav} aria-label="Previous page">
        <ChevronLeft />
      </ArkPagination.PrevTrigger>

      <ArkPagination.Context>
        {(pagination) =>
          pagination.pages.map((page, i) =>
            page.type === 'page' ? (
              <ArkPagination.Item key={i} {...page} className={baseItem}>
                {page.value}
              </ArkPagination.Item>
            ) : (
              <ArkPagination.Ellipsis
                key={i}
                index={i}
                className={baseEllipsis}
              >
                &#8230;
              </ArkPagination.Ellipsis>
            )
          )
        }
      </ArkPagination.Context>

      <ArkPagination.NextTrigger className={baseNav} aria-label="Next page">
        <ChevronRight />
      </ArkPagination.NextTrigger>
    </ArkPagination.Root>
  )
}

Pagination.displayName = 'Pagination'
