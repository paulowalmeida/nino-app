import { useEffect, useRef } from 'react'

import { Box } from '@ds/components/Box/Box'
import { Chip } from '@nino/ds/components/Chip'
import { CountUp } from '@nino/ds/components/CountUp'
import { Icon } from '@nino/ds/components/Icon'
import type { StageOption } from '@pages/Orders/types/stage-option'
import type { OrderStage } from '@shared/types/order/order-stage'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from '@pages/Orders/components/StageTrack/StageTrack.module.css'

export type StageTrackProps = {
  stages: StageOption[]
  value: OrderStage
  onChange: (stage: OrderStage) => void
}

export const StageTrack = ({ stages, value, onChange }: StageTrackProps) => {
  const animationFrame = useRef<number | null>(null)
  const targetScrollLeft = useRef(0)
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  })

  useEffect(
    () => () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current)
      }
    },
    []
  )

  const animateScroll = (track: HTMLElement) => {
    const distance = targetScrollLeft.current - track.scrollLeft

    if (Math.abs(distance) < 0.5) {
      track.scrollLeft = targetScrollLeft.current
      animationFrame.current = null
      return
    }

    track.scrollLeft += distance * 0.28
    animationFrame.current = requestAnimationFrame(() => animateScroll(track))
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    }
    targetScrollLeft.current = event.currentTarget.scrollLeft
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (drag.current.pointerId !== event.pointerId) return
    const distance = event.clientX - drag.current.startX
    if (Math.abs(distance) > 10 && !drag.current.moved) {
      drag.current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (!drag.current.moved) return
    event.preventDefault()
    const maxScrollLeft =
      event.currentTarget.scrollWidth - event.currentTarget.clientWidth
    targetScrollLeft.current = Math.min(
      Math.max(drag.current.startScrollLeft - distance, 0),
      maxScrollLeft
    )

    if (animationFrame.current === null) {
      const track = event.currentTarget
      animationFrame.current = requestAnimationFrame(() => animateScroll(track))
    }
  }

  const finishDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (drag.current.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    drag.current.pointerId = -1
  }

  return (
    <Box
      direction="row"
      className={styles.track}
      role="tablist"
      aria-label="Etapas da fila"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClickCapture={(event) => {
        if (!drag.current.moved) return
        event.preventDefault()
        event.stopPropagation()
        drag.current.moved = false
      }}
    >
      {stages.map(({ id, label, count, icon }, index) => (
        <Chip
          key={id}
          variant="tab"
          selected={id === value}
          onClick={() => onChange(id)}
          style={riseDelay(index * 60 + 60)}
          className={`${motion.deal} ${styles.stage} ${
            id === value ? styles.current : ''
          }`}
        >
          <Icon name={icon} className={styles.icon} />
          <span className={styles.label}>{label}</span>
          <span className={styles.count}>
            <CountUp value={count} />
          </span>
        </Chip>
      ))}
    </Box>
  )
}
