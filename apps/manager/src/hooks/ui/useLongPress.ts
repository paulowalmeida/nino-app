import { useCallback, useEffect, useRef, useState } from 'react'

const HOLD_MS = 450

const SLIP_PX = 10

type LongPressOptions = {
  onLongPress: () => void
  onRelease?: () => void
}

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

  const onClickCapture = useCallback((event: React.MouseEvent) => {
    if (!fired.current) return

    event.preventDefault()
    event.stopPropagation()
    fired.current = false
  }, [])

  const onContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
  }, [])

  return {
    isPressing,
    handlers: { onPointerDown, onPointerMove, onClickCapture, onContextMenu },
  }
}
