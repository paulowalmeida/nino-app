import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BRAND_THEMES } from '@pages/Units/constants/unit.constants'

import { BrandThemes } from './BrandThemes'
import { brandThemesColorsMock } from './BrandThemes.mock'

describe(BrandThemes.name, () => {
  it('marks the theme the store is already using', () => {
    render(<BrandThemes colors={brandThemesColorsMock} onApply={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Brasa' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Horta' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('applies the whole palette of the chosen theme at once', () => {
    const onApply = vi.fn()
    render(<BrandThemes colors={brandThemesColorsMock} onApply={onApply} />)

    fireEvent.click(screen.getByRole('button', { name: 'Meia-noite' }))

    const midnight = BRAND_THEMES.find(({ id }) => id === 'meia-noite')
    expect(onApply).toHaveBeenCalledWith(midnight?.colors)
  })
})
