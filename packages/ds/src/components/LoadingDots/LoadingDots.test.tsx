import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoadingDots } from './LoadingDots'

describe(LoadingDots.name, () => {
  it('renders when visible is true', () => {
    render(<LoadingDots visible />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not render when visible is false', () => {
    render(<LoadingDots visible={false} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('uses default label when not provided', () => {
    render(<LoadingDots visible />)
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Carregando'
    )
  })

  it('applies custom label', () => {
    render(<LoadingDots visible label="Carregando" />)
    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Carregando'
    )
  })
})
