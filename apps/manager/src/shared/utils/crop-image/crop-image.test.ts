import { describe, expect, it } from 'vitest'

import { cropToArea } from './crop-image'

describe('cropToArea', () => {
  it('rejects when the canvas has no 2d drawing context', async () => {
    // Arrange: jsdom ships no canvas backend, so getContext('2d') is null —
    // exactly the environment this guard exists for.
    const image = new Image()

    // Act / Assert
    await expect(
      cropToArea(image, { x: 0, y: 0, width: 1, height: 1 }, 'photo.jpg')
    ).rejects.toThrow('canvas indisponível')
  })
})
