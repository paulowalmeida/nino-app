import { useEffect, useRef, useState } from 'react'

import type { CountUpProps } from './CountUp.types'

const DURATION = 420

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Counts from the previous value to the next one. The movement is the point:
 * a number that changes silently reads as a static report, and the board is
 * meant to show that the store is alive.
 */
export const CountUp = ({ value }: CountUpProps) => {
  const [shown, setShown] = useState(value)
  const fromRef = useRef(value)
  const frameRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    if (from === value || prefersReducedMotion()) {
      fromRef.current = value
      setShown(value)
      return
    }

    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      const eased = 1 - (1 - progress) ** 3
      setShown(Math.round(from + (value - from) * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
      else fromRef.current = value
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <>{shown}</>
}
