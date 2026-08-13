import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Separator } from './Separator'
import styles from './Separator.module.css'

describe(Separator.name, () => {
  it('stays out of the accessibility tree by default', () => {
    // Arrange / Act
    const { container, queryByRole } = render(<Separator />)

    // Assert
    expect(queryByRole('separator')).not.toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('announces itself when semantic', () => {
    // Arrange / Act
    const { getByRole } = render(<Separator semantic />)

    // Assert
    expect(getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal'
    )
  })

  it('reports the vertical orientation when semantic', () => {
    // Arrange / Act
    const { getByRole } = render(<Separator semantic orientation="vertical" />)

    // Assert
    expect(getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    )
  })

  it('applies the orientation class', () => {
    // Arrange / Act
    const { container } = render(<Separator orientation="vertical" />)

    // Assert
    expect(container.firstElementChild).toHaveClass(styles.orientationVertical)
  })

  it('applies additional className', () => {
    // Arrange / Act
    const { container } = render(<Separator className="my-4" />)

    // Assert
    expect(container.firstElementChild).toHaveClass('my-4')
  })
})
