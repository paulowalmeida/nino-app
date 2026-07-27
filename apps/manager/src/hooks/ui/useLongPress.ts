import { useCallback, useEffect, useRef, useState } from 'react'

/** Tempo até o gesto virar "segurar". Abaixo disso ainda é um toque. */
const HOLD_MS = 400

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


  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    origin.current = null
    setPressing(false)
  }, [])

  /*
   * O menu de contexto é barrado no documento, não no elemento: quando o
   * Chrome resolve abri-lo, o dedo já está sobre o preview, não sobre o card.
   */
  useEffect(() => {
    if (!isPressing) return

    const block = (event: Event) => event.preventDefault()
    document.addEventListener('contextmenu', block, { capture: true })

    return () =>
      document.removeEventListener('contextmenu', block, { capture: true })
  }, [isPressing])

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

        /*
         * A soltura é armada aqui, no mesmo instante da abertura, e não num
         * efeito: o preview abre um diálogo que interrompe os eventos alheios
         * e provoca novo render, e amarrar isso a dependência de efeito
         * deixava o preview aberto depois de o dedo sair. Em captura e com
         * `once`, escuta uma vez e se desfaz sozinho.
         */
        const finish = () => {
          clearTimer()
          onRelease?.()
        }

        const armed = { once: true, capture: true } as const
        document.addEventListener('pointerup', finish, armed)
        document.addEventListener('pointercancel', finish, armed)
      }, HOLD_MS)
    },
    [onLongPress, onRelease, clearTimer]
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!origin.current || fired.current) return

      const slipped =
        Math.abs(event.clientX - origin.current.x) > SLIP_PX ||
        Math.abs(event.clientY - origin.current.y) > SLIP_PX

      if (slipped) clearTimer()
    },
    [clearTimer]
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
    handlers: {
      onPointerDown,
      onPointerMove,
      onClickCapture,
      onContextMenu,
    },
  }
}
