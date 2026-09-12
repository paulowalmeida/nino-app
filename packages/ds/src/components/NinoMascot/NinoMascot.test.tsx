import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NinoMascot } from './NinoMascot'

describe(NinoMascot.name, () => {
  it('hides the decorative mascot image from assistive tech', () => {
    // Arrange
    const { container } = render(<NinoMascot />)

    // Act
    const image = container.querySelector('img')

    // Assert
    expect(image).toHaveAttribute('aria-hidden', 'true')
    expect(image).toHaveAttribute('alt', '')
  })

  it('points at the mascot file', () => {
    // Arrange
    const { container } = render(<NinoMascot />)

    // Act
    const image = container.querySelector('img')

    // Assert
    expect(image).toHaveAttribute('src', expect.stringContaining('nino_gestor'))
  })

  it('applies the given className to the image', () => {
    // Arrange
    const { container } = render(<NinoMascot className="floating" />)

    // Act
    const image = container.querySelector('img')

    // Assert
    expect(image).toHaveClass('floating')
  })
})
