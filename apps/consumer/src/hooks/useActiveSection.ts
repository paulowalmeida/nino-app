import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

const DESKTOP_LINE = 96
const MOBILE_LINE = 60

/**
 * Qual seção está sob os olhos agora: acompanha o scroll para acender a
 * categoria certa na trilha. No celular o scroll mora dentro da lista de
 * produtos (rootRef); no desktop a página rola no documento. Em vez de confiar
 * num IntersectionObserver — que dispara durante o layout instável do load e
 * não se corrige sozinho — mede as posições a cada scroll: ativa é a última
 * seção cujo topo já passou da linha de leitura no alto da lista.
 */
export const useActiveSection = (
  ids: string[],
  rootRef?: RefObject<HTMLElement | null>
): string | null => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    const desktop = window.matchMedia('(min-width: 1024px)').matches
    const scroller: HTMLElement | Window | null = desktop
      ? window
      : (rootRef?.current ?? null)
    if (!scroller) return

    const lineTop = (): number => {
      if (desktop) return DESKTOP_LINE
      const top = rootRef?.current?.getBoundingClientRect().top ?? 0
      return top + MOBILE_LINE
    }

    const compute = (): void => {
      const line = lineTop()
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - line > 1) break
        current = id
      }
      setActive(current)
    }

    compute()
    scroller.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)

    return () => {
      scroller.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ids, rootRef])

  return active
}
