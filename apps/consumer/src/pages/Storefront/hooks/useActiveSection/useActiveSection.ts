import { useEffect, useState } from 'react'

/**
 * Qual seção está sob os olhos agora: acompanha o scroll para acender a
 * categoria certa na régua.
 *
 * Mede posições a cada scroll em vez de usar IntersectionObserver — ele
 * dispara durante o layout instável do carregamento e não se corrige sozinho.
 * Ativa é a última seção cujo topo já passou da linha de leitura.
 *
 * A linha fica abaixo das duas barras fixas (topo + régua): acender a
 * categoria seguinte enquanto o título dela ainda está escondido atrás delas
 * faz a régua apontar para o que ninguém está vendo.
 */
const READING_LINE = 130

export const useActiveSection = (ids: string[]): string | null => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    let frame = 0

    const compute = (): void => {
      frame = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - READING_LINE > 1) break
        current = id
      }
      setActive((previous) => (previous === current ? previous : current))
    }

    const onScroll = (): void => {
      if (frame) return
      frame = window.requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}
