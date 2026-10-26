import { Pagination as ArkPagination } from '@ark-ui/react/pagination'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Icon } from '../Icon/Icon'
import styles from './Pagination.module.css'

type PaginationProps = {
  /**
   * How many items there are in total, not how many pages — the pages come
   * from dividing this by `pageSize`
   */
  count: number
  /** Items per page. Default: `10` */
  pageSize?: number
  /**
   * Current page, when the screen keeps it (in the URL, for instance). Leave
   * it out and pass `defaultPage` to let the component keep its own
   */
  page?: number
  defaultPage?: number
  /**
   * How many pages show on each side of the current one before the ellipsis.
   * Default: `1`
   */
  siblingCount?: number
  onPageChange?: (page: number) => void
  className?: string
}

/**
 * Page numbers for a list that does not fit on one screen.
 *
 * Same object as the tabs: a lowered rail with a raised plate marking where
 * the person is in the sequence.
 *
 * ```tsx
 * <Pagination count={total} pageSize={20} page={page} onPageChange={setPage} />
 * ```
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
      className={mergeClasses(styles.pageBar, className)}
    >
      <ArkPagination.PrevTrigger
        className={styles.stepButton}
        aria-label="Página anterior"
      >
        <Icon name="chevron-left" />
      </ArkPagination.PrevTrigger>

      <ArkPagination.Context>
        {(pagination) =>
          pagination.pages.map((entry, i) =>
            entry.type === 'page' ? (
              <ArkPagination.Item
                key={i}
                {...entry}
                className={styles.pageButton}
              >
                {entry.value}
              </ArkPagination.Item>
            ) : (
              <ArkPagination.Ellipsis
                key={i}
                index={i}
                className={styles.ellipsis}
              >
                &#8230;
              </ArkPagination.Ellipsis>
            )
          )
        }
      </ArkPagination.Context>

      <ArkPagination.NextTrigger
        className={styles.stepButton}
        aria-label="Próxima página"
      >
        <Icon name="chevron-right" />
      </ArkPagination.NextTrigger>
    </ArkPagination.Root>
  )
}
