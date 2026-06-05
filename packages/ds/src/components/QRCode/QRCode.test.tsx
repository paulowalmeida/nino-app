import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QRCode } from './QRCode'

describe(QRCode.name, () => {
  it('renders an svg frame for the value', () => {
    const { container } = render(<QRCode value="https://nino.delivery" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies the requested size', () => {
    const { container } = render(<QRCode value="x" size={96} />)
    const root = container.querySelector('[data-part="root"]') as HTMLElement
    expect(root.style.width).toBe('96px')
  })
})
