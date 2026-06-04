import { Pagination as ArkPagination } from '@ark-ui/react/pagination'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { PaginationProps } from './Pagination.types'

const baseRoot = 'flex items-center gap-1'

const baseNav =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)] hover:text-brand disabled:pointer-events-none disabled:opacity-40'

const baseItem =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm text-gray-700 transition-colors hover:bg-[color-mix(in_srgb,var(--color-brand)_10%,white)] hover:text-brand data-[selected]:bg-brand data-[selected]:text-brand-foreground data-[selected]:hover:bg-brand-hover'

const baseEllipsis =
  'inline-flex h-9 min-w-9 items-center justify-center text-sm text-gray-400'

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
