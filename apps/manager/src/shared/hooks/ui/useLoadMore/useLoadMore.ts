import { useCallback, useRef } from 'react'

export const useLoadMore = (
  hasNextPage: boolean,
  fetchNextPage: () => void
) => {
  const observer = useRef<IntersectionObserver | null>(null)

  return useCallback(
    (sentinel: HTMLDivElement | null) => {
      observer.current?.disconnect()
      if (!sentinel || !hasNextPage) return

      const root = sentinel.closest('[data-part=viewport]')

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) fetchNextPage()
        },
        { root, rootMargin: '200px' }
      )

      observer.current.observe(sentinel)
    },
    [hasNextPage, fetchNextPage]
  )
}
