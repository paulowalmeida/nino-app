import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Stamp } from './Stamp'
import styles from './Stamp.module.css'

describe(Stamp.name, () => {
  it('centres whatever it holds', () => {
    // Arrange / Act
    render(<Stamp>x</Stamp>)

    // Assert
    expect(screen.getByText('x')).toHaveClass(styles.stamp)
  })

  it.each([
    ['sm', styles.sizeSmall],
    ['md', styles.sizeMedium],
    ['lg', styles.sizeLarge],
  ] as const)('renders size %s', (size, sizeClassName) => {
    // Arrange / Act
    render(<Stamp size={size}>x</Stamp>)

    // Assert
    expect(screen.getByText('x')).toHaveClass(sizeClassName)
  })

  it.each([
    ['brand', styles.toneBrand],
    ['brandSoft', styles.toneBrandSoft],
    ['brandStrong', styles.toneBrandStrong],
    ['success', styles.toneSuccess],
    ['warning', styles.toneWarning],
    ['danger', styles.toneDanger],
    ['neutral', styles.toneNeutral],
    ['inverse', styles.toneInverse],
  ] as const)('renders tone %s', (tone, toneClassName) => {
    // Arrange / Act
    render(<Stamp tone={tone}>x</Stamp>)

    // Assert
    expect(screen.getByText('x')).toHaveClass(toneClassName)
  })

  it('keeps an extra className, for a tone that follows the parent state', () => {
    // Arrange / Act
    render(<Stamp className="group-data-[state=open]:bg-brand">x</Stamp>)

    // Assert
    expect(screen.getByText('x')).toHaveClass(
      'group-data-[state=open]:bg-brand'
    )
  })
})
