import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Separator } from './Separator'

describe(Separator.name, () => {
  it('renders with role separator', () => {
    const { getByRole } = render(<Separator />)
    expect(getByRole('separator')).toBeInTheDocument()
  })

  it('has horizontal orientation by default', () => {
    const { getByRole } = render(<Separator />)
    expect(getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'horizontal'
    )
  })

  it('applies vertical orientation', () => {
    const { getByRole } = render(<Separator orientation="vertical" />)
    expect(getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical'
    )
  })

  it('applies additional className', () => {
    const { getByRole } = render(<Separator className="my-4" />)
    expect(getByRole('separator')).toHaveClass('my-4')
  })
})
