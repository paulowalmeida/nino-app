export interface PaginationProps {
  /** Total number of items (not pages) */
  count: number
  /** Items per page. Default: 10 */
  pageSize?: number
  /** Current page (controlled) */
  page?: number
  /** Initial page (uncontrolled). Default: 1 */
  defaultPage?: number
  /** Number of sibling pages shown on each side of the current page. Default: 1 */
  siblingCount?: number
  onPageChange?: (page: number) => void
  className?: string
}
