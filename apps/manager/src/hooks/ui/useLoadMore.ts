import { useCallback, useRef } from 'react'

/**
 * Carrega a próxima página quando a sentinela entra em cena. A raiz do
 * observador é o viewport do `ScrollArea` mais próximo — sem isso o navegador
 * compara com a janela, que nunca rola nessas telas, e a próxima página só
 * viria no clique.
 *
 * `rootMargin` de 200px busca antes de a pessoa chegar ao fim: quando a lista
 * termina, a próxima já está lá.
 */
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
