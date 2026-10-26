import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QRCode } from './QRCode'

describe(QRCode.name, () => {
  it('renders an svg frame for the value', () => {
    // Arrange / Act
    const { container } = render(<QRCode value="https://nino.delivery" />)

    // Assert
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies the requested size', () => {
    // Arrange / Act
    const { container } = render(<QRCode value="x" size={96} />)

    // Assert
    const root = container.querySelector('[data-part="root"]') as HTMLElement
    expect(root.style.width).toBe('96px')
  })

  it('announces itself by the given label', () => {
    // Arrange / Act
    render(<QRCode value="x" label="Código do cardápio" />)

    // Assert
    expect(
      screen.getByRole('img', { name: 'Código do cardápio' })
    ).toBeInTheDocument()
  })

  it('renders the logo over the code when given one', () => {
    // Arrange / Act
    render(<QRCode value="x" logo={<span>logo</span>} />)

    // Assert
    expect(screen.getByText('logo')).toBeInTheDocument()
  })
})
