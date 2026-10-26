import { describe, expect, it } from 'vitest'

import { toCenteredCropArea } from './toCenteredCropArea'
import { centeredCropCasesMock } from './toCenteredCropArea.mock'

describe('toCenteredCropArea', () => {
  it('takes the full height of an image wider than the crop', () => {
    const { imageRatio, aspectRatio } =
      centeredCropCasesMock.wideImageSquareCrop

    expect(toCenteredCropArea(imageRatio, aspectRatio)).toEqual({
      x: 0.25,
      y: 0,
      width: 0.5,
      height: 1,
    })
  })

  it('takes the full width of an image taller than the crop', () => {
    const { imageRatio, aspectRatio } =
      centeredCropCasesMock.tallImageSquareCrop

    expect(toCenteredCropArea(imageRatio, aspectRatio)).toEqual({
      x: 0,
      y: 0.25,
      width: 1,
      height: 0.5,
    })
  })

  it('centers a banner strip on a square image', () => {
    const { imageRatio, aspectRatio } =
      centeredCropCasesMock.squareImageBannerCrop
    const area = toCenteredCropArea(imageRatio, aspectRatio)

    expect(area.width).toBe(1)
    expect(area.height).toBeCloseTo(1 / 3, 6)
    expect(area.y).toBeCloseTo(1 / 3, 6)
  })
})
