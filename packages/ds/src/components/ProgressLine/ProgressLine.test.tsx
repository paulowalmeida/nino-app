import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressLine } from './ProgressLine'

describe(ProgressLine.name, () => {
  it('renders without errors', () => {
    const { container } = render(<ProgressLine value={50} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('accepts null value for indeterminate state', () => {
    const { container } = render(<ProgressLine value={null} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)(
    'renderiza tamanho %s sem erros',
    (size) => {
      const { container } = render(<ProgressLine value={50} size={size} />)
      expect(container.firstChild).toBeInTheDocument()
    }
  )

  it('applies additional className', () => {
    const { container } = render(
      <ProgressLine value={50} className="opacity-disabled" />
    )
    expect(container.firstChild).toHaveClass('opacity-disabled')
  })
})
