import { useEffect, useState } from 'react'

/**
 * Qual seção está sob os olhos agora: acompanha o scroll para acender a
 * categoria certa na régua.
 *
 * Mede posições a cada scroll em vez de usar IntersectionObserver — ele
 * dispara durante o layout instável do carregamento e não se corrige sozinho.
 * Ativa é a última seção cujo topo já passou da linha de leitura.
 *
 * A linha sai do `scroll-margin-top` da própria seção, que já é a distância
 * necessária para o título escapar das barras fixas. Fixá-la num número aqui
 * criava três constantes que precisavam concordar entre si — header, margem e
 * linha — e elas divergiam a cada mudança de altura do header.
 *
 * WHY: a folga existe porque uma seção alcançada por clique para exatamente
 * sobre a margem; sem ela o chip da categoria anterior continuava aceso.
 *
 * WORKAROUND: quando a última seção é curta, o documento não tem altura
 * suficiente abaixo dela para o scroll empurrar seu topo até a linha de
 * leitura — o navegador trava no fim da página antes disso acontecer, e o
 * loop nunca a promove a `current`. Ao alcançar o fim do documento, a última
 * seção é forçada como ativa independente da posição do seu topo.
 */
const READING_LINE_SLACK = 8
const END_OF_DOCUMENT_SLACK = 1

export const useActiveSection = (ids: string[]): string | null => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    let frame = 0

    const isAtDocumentEnd = (): boolean => {
      const { scrollHeight } = document.documentElement
      return (
        scrollHeight > window.innerHeight &&
        window.innerHeight + window.scrollY >=
          scrollHeight - END_OF_DOCUMENT_SLACK
      )
    }

    const compute = (): void => {
      frame = 0

      if (isAtDocumentEnd()) {
        setActive((previous) =>
          previous === ids[ids.length - 1] ? previous : ids[ids.length - 1]
        )
        return
      }

      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const readingLine =
          (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) +
          READING_LINE_SLACK
        if (el.getBoundingClientRect().top - readingLine > 1) break
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
