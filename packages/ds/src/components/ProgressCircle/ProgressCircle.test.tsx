import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressCircle } from './ProgressCircle'

describe(ProgressCircle.name, () => {
  it('renders the SVG', () => {
    const { container } = render(<ProgressCircle value={50} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('accepts null value for indeterminate state', () => {
    const { container } = render(<ProgressCircle value={null} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      const { container } = render(<ProgressCircle value={50} size={size} />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    }
  )

  it('applies additional className', () => {
    const { container } = render(
      <ProgressCircle value={50} className="opacity-50" />
    )
    expect(container.firstChild).toHaveClass('opacity-50')
  })
})
