import { useCallback, useEffect, useRef, useState } from 'react'

/** Tempo até o gesto virar "segurar". Abaixo disso ainda é um toque. */
const HOLD_MS = 450

/** Quanto o dedo pode escorregar antes de virar rolagem. */
const SLIP_PX = 10

type LongPressOptions = {
  onLongPress: () => void
  onRelease?: () => void
}

/**
 * Pressionar e segurar, como o preview de foto do Instagram.
 *
 * Pointer em vez de mouse e touch separados: o mesmo gesto vale para dedo,
 * clique e caneta, e um toque simples não gera `touchmove` — ouvir só
 * movimento deixaria o celular sem resposta.
 *
 * O clique seguinte é engolido de propósito. No balcão o card já adiciona o
 * item à venda; sem isso, soltar o dedo depois de espiar somaria um produto
 * no meio do atendimento.
 */
export const useLongPress = ({ onLongPress, onRelease }: LongPressOptions) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const origin = useRef<{ x: number; y: number } | null>(null)
  const fired = useRef(false)
  const [isPressing, setPressing] = useState(false)

  const cancelTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    origin.current = null
    setPressing(false)
  }, [])

  /*
   * Tudo o que encerra o gesto vive aqui, e é ouvido no documento porque o
   * que o gesto abre cobre a tela e deixa o resto inerte — no elemento, o
   * evento não voltaria.
   *
   * Soltar antes da conta é clique comum e só desarma o relógio; soltar
   * depois fecha o que abriu. Sem esta escuta, largar o dedo cedo deixava o
   * relógio correndo e o preview abria sozinho depois do clique.
   */
  useEffect(() => {
    if (!isPressing) return

    const block = (event: Event) => event.preventDefault()

    const end = () => {
      const opened = fired.current
      cancelTimer()
      if (opened) onRelease?.()
    }

    const options = { capture: true } as const

    document.addEventListener('contextmenu', block, options)
    document.addEventListener('pointerup', end, options)
    document.addEventListener('pointercancel', end, options)

    return () => {
      document.removeEventListener('contextmenu', block, options)
      document.removeEventListener('pointerup', end, options)
      document.removeEventListener('pointercancel', end, options)
    }
  }, [isPressing, cancelTimer, onRelease])

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      /* Botão direito e cliques secundários não são o gesto. */
      if (event.button !== 0) return

      fired.current = false
      origin.current = { x: event.clientX, y: event.clientY }
      setPressing(true)

      timer.current = setTimeout(() => {
        fired.current = true
        onLongPress()
      }, HOLD_MS)
    },
    [onLongPress]
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!origin.current || fired.current) return

      const slipped =
        Math.abs(event.clientX - origin.current.x) > SLIP_PX ||
        Math.abs(event.clientY - origin.current.y) > SLIP_PX

      if (slipped) cancelTimer()
    },
    [cancelTimer]
  )

  /* Engole o clique que vem depois do gesto — e só ele. */
  const onClickCapture = useCallback((event: React.MouseEvent) => {
    if (!fired.current) return

    event.preventDefault()
    event.stopPropagation()
    fired.current = false
  }, [])

  /* O menu de contexto do celular aparece ao segurar e atrapalha o gesto. */
  const onContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
  }, [])

  return {
    isPressing,
    handlers: { onPointerDown, onPointerMove, onClickCapture, onContextMenu },
  }
}
