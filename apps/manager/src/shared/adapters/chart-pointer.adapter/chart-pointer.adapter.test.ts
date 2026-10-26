import { describe, expect, it, vi } from 'vitest'

import { toPointerTime } from './chart-pointer.adapter'
import { pointerMarginMock, pointerXMock } from './chart-pointer.adapter.mock'

vi.mock('@visx/event', () => ({
  localPoint: vi.fn(() => ({ x: pointerXMock })),
}))

describe(toPointerTime.name, () => {
  it('converts the pointer position to the chart timestamp', () => {
    const invert = vi.fn((x: number) => new Date(x))
    const result = toPointerTime(
      {} as React.PointerEvent,
      { invert },
      pointerMarginMock
    )

    expect(invert).toHaveBeenCalledWith(pointerXMock - pointerMarginMock)
    expect(result).toBe(pointerXMock - pointerMarginMock)
  })

  it('returns null when visx cannot resolve the point', async () => {
    const { localPoint } = await import('@visx/event')
    vi.mocked(localPoint).mockReturnValueOnce(null)

    expect(toPointerTime({} as React.PointerEvent, { invert: vi.fn() }, 0)).toBeNull()
  })
})
