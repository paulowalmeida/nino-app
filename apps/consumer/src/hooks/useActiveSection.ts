import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Qual seção está sob os olhos agora: acompanha o scroll para acender a
 * categoria certa na trilha. No celular o scroll mora dentro da lista de
 * produtos, então o observer olha esse container (rootRef); no desktop a página
 * rola no documento e o root é a viewport. Entre as seções visíveis, vence a de
 * topo mais baixo — a que acabou de encostar no alto da lista.
 */
export const useActiveSection = (
  ids: string[],
  rootRef?: RefObject<HTMLElement | null>
): string | null => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    const desktop = window.matchMedia('(min-width: 1024px)').matches
    const root = desktop ? null : (rootRef?.current ?? null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const top = visible.reduce((current, entry) =>
          entry.boundingClientRect.top > current.boundingClientRect.top
            ? entry
            : current
        )
        setActive(top.target.id)
      },
      {
        root,
        rootMargin: root ? '0px 0px -70% 0px' : '-96px 0px -70% 0px',
        threshold: 0,
      }
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [ids, rootRef])

  return active
}
