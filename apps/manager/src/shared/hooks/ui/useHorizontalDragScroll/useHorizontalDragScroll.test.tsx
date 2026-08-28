import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useHorizontalDragScroll } from './useHorizontalDragScroll'
import { horizontalDragScrollMock } from './useHorizontalDragScroll.mock'

const Track = () => {
  const trackRef = useHorizontalDragScroll<HTMLDivElement>()
  return (
    <div ref={trackRef} data-testid="track">
      <button>Bebidas</button>
    </div>
  )
}

/* WHY: jsdom não implementa scroll suave — o stub aplica o delta na hora
 * só pra provar que o hook decidiu rolar; a suavidade é do navegador. */
const renderOverflowingTrack = () => {
  render(<Track />)
  const track = screen.getByTestId('track')
  Object.defineProperty(track, 'scrollWidth', {
    value: horizontalDragScrollMock.scrollWidth,
    configurable: true,
  })
  Object.defineProperty(track, 'clientWidth', {
    value: horizontalDragScrollMock.clientWidth,
    configurable: true,
  })
  track.scrollBy = vi.fn(({ left }: ScrollToOptions) => {
    track.scrollLeft += left ?? 0
  }) as unknown as typeof track.scrollBy
  return track
}

describe('useHorizontalDragScroll', () => {
  it('turns a vertical wheel into a smooth scroll when it overflows', () => {
    const track = renderOverflowingTrack()

    fireEvent.wheel(track, { deltaY: 120, deltaX: 0 })

    expect(track.scrollBy).toHaveBeenCalledWith({
      left: 120,
      behavior: 'smooth',
    })
    expect(track.scrollLeft).toBe(120)
  })

  it('leaves the wheel gesture alone when the list already fits', () => {
    const track = renderOverflowingTrack()
    Object.defineProperty(track, 'scrollWidth', { value: 300 })
    Object.defineProperty(track, 'clientWidth', { value: 300 })

    fireEvent.wheel(track, { deltaY: 120, deltaX: 0 })

    expect(track.scrollLeft).toBe(0)
  })

  it('leaves an already-horizontal gesture to the browser', () => {
    const track = renderOverflowingTrack()

    fireEvent.wheel(track, { deltaY: 20, deltaX: 40 })

    expect(track.scrollLeft).toBe(0)
  })

  it('drags the track and cancels the click that follows', () => {
    const track = renderOverflowingTrack()

    fireEvent.pointerDown(track, { pointerId: 1, clientX: 200 })
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 150 })
    fireEvent.pointerUp(track, { pointerId: 1, clientX: 150 })
    const click = fireEvent.click(screen.getByRole('button'))

    expect(track.scrollLeft).toBe(50)
    expect(click).toBe(false)
  })

  it('suspends scroll-snap during the drag and restores it after', () => {
    const track = renderOverflowingTrack()

    fireEvent.pointerDown(track, { pointerId: 1, clientX: 200 })
    expect(track.style.scrollSnapType).toBe('none')

    fireEvent.pointerUp(track, { pointerId: 1, clientX: 150 })
    expect(track.style.scrollSnapType).toBe('')
  })

  it('ignores touch pointers, which already scroll natively', () => {
    const track = renderOverflowingTrack()

    fireEvent.pointerDown(track, {
      pointerId: 1,
      clientX: 200,
      pointerType: 'touch',
    })
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 150 })

    expect(track.scrollLeft).toBe(0)
  })

  it('does not cancel a click when the pointer barely moved', () => {
    const track = renderOverflowingTrack()

    fireEvent.pointerDown(track, { pointerId: 1, clientX: 200 })
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 201 })
    fireEvent.pointerUp(track, { pointerId: 1, clientX: 201 })
    const click = fireEvent.click(screen.getByRole('button'))

    expect(click).toBe(true)
  })
})
