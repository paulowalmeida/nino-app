import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DisclosureSeal } from './DisclosureSeal'
import styles from './DisclosureSeal.module.css'

describe(DisclosureSeal.name, () => {
  it('draws a chevron', () => {
    // Arrange / Act
    const { container } = render(<DisclosureSeal />)

    // Assert
    expect(container.querySelector('use')?.getAttribute('href')).toMatch(
      /#chevron-down$/
    )
  })

  it('turns to full ink once the panel next to it opens', () => {
    // Arrange / Act
    const { container } = render(<DisclosureSeal />)

    // Assert
    expect(container.firstChild).toHaveClass(styles.seal)
  })

  it('keeps an extra className', () => {
    // Arrange / Act
    const { container } = render(<DisclosureSeal className="ml-2" />)

    // Assert
    expect(container.firstChild).toHaveClass('ml-2')
  })
})
