import { useEffect, useRef } from 'react'

/* Clique de mouse quase sempre desloca alguns pixels. Com 4px, o gesto comum
   já virava arrasto e o listener em captura cancelava a ativação do Chip. */
const DRAG_THRESHOLD_PX = 12

/* WHY: no touch a lista arrasta com o dedo; no mouse não existe gesto
 * equivalente. React trata onWheel/onPointer como listener passivo, então
 * preventDefault() ali é ignorado — o listener nativo aqui não tem essa
 * limitação. */
export const useHorizontalDragScroll = <T extends HTMLElement>() => {
  const trackRef = useRef<T | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    /* WHY: `scrollBy` com behavior smooth anima o salto do wheel; setar
     * scrollLeft direto (usado no arrasto) pula sem transição alguma. */
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      if (track.scrollWidth <= track.clientWidth) return

      event.preventDefault()
      track.scrollBy({ left: event.deltaY, behavior: 'smooth' })
    }

    let isDragging = false
    let dragged = false
    let pointerCaptured = false
    let startX = 0
    let startScrollLeft = 0

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      isDragging = true
      dragged = false
      pointerCaptured = false
      startX = event.clientX
      startScrollLeft = track.scrollLeft
      /* WHY: scroll-snap disputa a posição a cada frame do arrasto e trava
       * o movimento; volta a valer quando o dedo/mouse solta. */
      track.style.scrollSnapType = 'none'
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return
      const delta = event.clientX - startX
      if (Math.abs(delta) > DRAG_THRESHOLD_PX && !dragged) {
        dragged = true
        track.setPointerCapture?.(event.pointerId)
        pointerCaptured = true
      }
      if (!dragged) return
      track.scrollLeft = startScrollLeft - delta
    }

    const endDrag = (event: PointerEvent) => {
      if (pointerCaptured && track.hasPointerCapture?.(event.pointerId)) {
        track.releasePointerCapture?.(event.pointerId)
      }
      isDragging = false
      pointerCaptured = false
      track.style.scrollSnapType = ''
    }

    /* WHY: captura na fase de captura pra cancelar o clique do Chip só
     * quando o gesto foi realmente um arrasto, não um toque parado. */
    const cancelClickAfterDrag = (event: MouseEvent) => {
      if (!dragged) return
      event.preventDefault()
      event.stopPropagation()
      dragged = false
    }

    track.addEventListener('wheel', handleWheel, { passive: false })
    track.addEventListener('pointerdown', handlePointerDown)
    track.addEventListener('pointermove', handlePointerMove)
    track.addEventListener('pointerup', endDrag)
    track.addEventListener('pointercancel', endDrag)
    track.addEventListener('click', cancelClickAfterDrag, true)

    return () => {
      track.removeEventListener('wheel', handleWheel)
      track.removeEventListener('pointerdown', handlePointerDown)
      track.removeEventListener('pointermove', handlePointerMove)
      track.removeEventListener('pointerup', endDrag)
      track.removeEventListener('pointercancel', endDrag)
      track.removeEventListener('click', cancelClickAfterDrag, true)
    }
  }, [])

  return trackRef
}
