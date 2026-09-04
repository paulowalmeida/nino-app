import { describe, expect, it } from 'vitest'

import { toResizedCropArea } from './toResizedCropArea'
import {
  squareImageCropMock,
  squareImageRatiosMock,
} from './toResizedCropArea.mock'

describe('toResizedCropArea', () => {
  it('grows from the south-east corner without moving the origin', () => {
    const area = toResizedCropArea({
      ...squareImageRatiosMock,
      area: squareImageCropMock,
      corner: 'se',
      deltaX: 0.1,
    })

    expect(area).toEqual({ x: 0.25, y: 0.25, width: 0.6, height: 0.6 })
  })

  it('grows from the north-west corner with the far corner fixed', () => {
    const area = toResizedCropArea({
      ...squareImageRatiosMock,
      area: squareImageCropMock,
      corner: 'nw',
      deltaX: -0.1,
    })

    expect(area.width).toBeCloseTo(0.6, 6)
    expect(area.x + area.width).toBeCloseTo(0.75, 6)
    expect(area.y + area.height).toBeCloseTo(0.75, 6)
  })

  it('stops at the edge of the image instead of overflowing it', () => {
    const area = toResizedCropArea({
      ...squareImageRatiosMock,
      area: squareImageCropMock,
      corner: 'se',
      deltaX: 5,
    })

    expect(area.width).toBeCloseTo(0.75, 6)
    expect(area.x + area.width).toBeCloseTo(1, 6)
  })

  it('never shrinks below the minimum usable crop', () => {
    const area = toResizedCropArea({
      ...squareImageRatiosMock,
      area: squareImageCropMock,
      corner: 'se',
      deltaX: -5,
    })

    expect(area.width).toBeCloseTo(0.08, 6)
  })

  it('keeps a banner crop three times wider than it is tall', () => {
    const area = toResizedCropArea({
      area: squareImageCropMock,
      corner: 'se',
      deltaX: 0.1,
      imageRatio: 1,
      aspectRatio: 3,
    })

    expect(area.width / area.height).toBeCloseTo(3, 6)
  })
})
