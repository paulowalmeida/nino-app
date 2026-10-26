import { useEffect, useState } from 'react'

/**
 * WHY: o limite da troca é o próprio campo de busca da página, não uma
 * distância em pixels. Enquanto ele estiver visível abaixo da faixa fixa, a
 * barra do topo não existe; quando ele passa por baixo dela, a barra assume e
 * oferece a lupa.
 *
 * WHY: recebe o elemento, não uma ref. O campo só é montado depois que o
 * cardápio carrega, e uma ref lida dentro do efeito ainda estaria vazia — o
 * observador nunca chegaria a observar nada.
 */
export const useDockedHeader = (
  target: HTMLElement | null,
  topOffset: number
): boolean => {
  const [isDocked, setDocked] = useState(false)

  useEffect(() => {
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setDocked(!entry.isIntersecting),
      { rootMargin: `-${topOffset}px 0px 100% 0px`, threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [target, topOffset])

  return isDocked
}
