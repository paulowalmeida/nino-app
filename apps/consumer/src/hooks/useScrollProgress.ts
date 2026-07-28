import { useEffect, useState } from 'react'

/**
 * Quanto da transição do topo já aconteceu, de 0 a 1, ao longo dos primeiros
 * `distance` pixels de rolagem.
 *
 * Progresso contínuo em vez de um booleano `scrolled`: o header da landing
 * troca de estado de uma vez porque só muda de cor, mas aqui a logo grande
 * precisa encolher até virar a do topo. Com liga/desliga isso vira um salto;
 * com progresso, vira movimento.
 *
 * Leitura em rAF: o evento de scroll dispara muito mais que um quadro, e
 * medir layout em cada disparo trava a rolagem justamente onde o efeito
 * deveria ser suave.
 */
export const useScrollProgress = (distance: number): number => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const next = Math.min(1, Math.max(0, window.scrollY / distance))
      setProgress((current) => (current === next ? current : next))
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [distance])

  return progress
}
