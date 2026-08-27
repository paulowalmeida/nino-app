import { describe, expect, it } from 'vitest'

import { cropToSquare } from './crop-image'

describe('cropToSquare', () => {
  it('rejects when the canvas has no 2d drawing context', async () => {
    // Arrange: jsdom ships no canvas backend, so getContext('2d') is null —
    // exactly the environment this guard exists for.
    const image = new Image()

    // Act / Assert
    await expect(
      cropToSquare(image, { offsetX: 0, offsetY: 0, zoom: 1 }, 'photo.jpg')
    ).rejects.toThrow('canvas indisponível')
  })
})
