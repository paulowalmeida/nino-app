import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useElementWidth } from '@hooks/ui/useElementWidth'

type ResizeCallback = (entries: ResizeObserverEntry[]) => void

const stubResizeObserver = () => {
  let trigger: ResizeCallback = () => {}

  class StubResizeObserver {
    constructor(callback: ResizeCallback) {
      trigger = callback
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', StubResizeObserver)
  return (width: number) =>
    act(() => trigger([{ contentRect: { width } } as ResizeObserverEntry]))
}

const Probe = ({ onWidth }: { onWidth: (width: number) => void }) => {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  onWidth(width)
  return <div ref={ref} />
}

describe(useElementWidth.name, () => {
  afterEach(() => vi.unstubAllGlobals())

  it('starts at zero before the element is measured', () => {
    // Arrange
    const onWidth = vi.fn()

    // Act
    render(<Probe onWidth={onWidth} />)

    // Assert
    expect(onWidth).toHaveBeenCalledWith(0)
  })

  it('updates the width when the observer reports a resize', () => {
    // Arrange
    const resize = stubResizeObserver()
    const onWidth = vi.fn()
    render(<Probe onWidth={onWidth} />)

    // Act
    resize(240)

    // Assert
    expect(onWidth).toHaveBeenLastCalledWith(240)
  })
})
